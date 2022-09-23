import mysql.connector
from mysql.connector import Error
import json
from copy import deepcopy
from collections import defaultdict
import sys

# This script has 1 parameter:
# --drop, which will drop all tables before inserting the data again

# Configs

db_config = {
    'host': 'localhost',
    'database': 'borg',
    'user': 'user',
    'password': 'pass'
}

# Paths to the files with data

collection_events_path = 'collection_events.json'
machine_events_path = 'machine_events.json'
instance_usage_path = 'instance_usage.json'
instance_events_path = 'instance_events.json'
machine_attributes_path = 'machine_attributes.json'

# SQL Queries

CREATE_TABLE_COLLECTION_EVENTS = """
    CREATE TABLE IF NOT EXISTS collection_events (
        alloc_collection_id BIGINT,
        collection_id BIGINT,
        collection_logical_name VARCHAR(50),
        collection_name VARCHAR(250),
        collection_type VARCHAR(10),
        max_per_machine INT,
        max_per_switch INT,
        missing_type VARCHAR(30),
        parent_collection_id BIGINT,
        priority INT,
        scheduler VARCHAR(20),
        scheduling_class VARCHAR(20),
        start_after_collection_ids BIGINT,
        time BIGINT,
        type VARCHAR(20),
        user VARCHAR(250),
        vertical_scaling VARCHAR(40)
    );
"""

collection_events_fields = [
    'alloc_collection_id', 
    'collection_id',
    'collection_logical_name',
    'collection_name',
    'collection_type',
    'max_per_machine',
    'max_per_switch',
    'missing_type',
    'parent_collection_id',
    'priority',
    'scheduler',
    'scheduling_class',
    'start_after_collection_ids',
    'time',
    'type',
    'user',
    'vertical_scaling',
]

INSERT_COLLECTION_EVENT = 'INSERT INTO collection_events (' + ','.join(collection_events_fields) + ') VALUES (' + ','.join(['%s'] * len(collection_events_fields)) + ');'

CREATE_TABLE_MACHINE_EVENTS = """
    CREATE TABLE IF NOT EXISTS machine_events (
        capacity_cpu DOUBLE,
        capacity_mem DOUBLE,
        machine_event VARCHAR(10),
        machine_id BIGINT,
        missing_data_reason VARCHAR(30),
        platform_id VARCHAR(250),
        switch_id VARCHAR(250),
        time BIGINT
    );
"""

machine_events_fields = [
    'capacity_cpu',
    'capacity_mem',
    'machine_event',
    'machine_id',
    'missing_data_reason',
    'platform_id',
    'switch_id', 
    'time'
]

INSERT_MACHINE_EVENT = 'INSERT INTO machine_events (' + ','.join(machine_events_fields) + ') VALUES (' + ','.join(['%s'] * len(machine_events_fields)) + ');'

CREATE_TABLE_MACHINE_ATTRIBUTES = """
    CREATE TABLE IF NOT EXISTS machine_attributes (
        time BIGINT,
        machine_id BIGINT,
        name VARCHAR(250),
        value VARCHAR(250),
        deleted BOOLEAN
    );
"""

machine_attributes_fields = [
    'time',
    'machine_id',
    'name',
    'value',
    'deleted'
]

INSERT_MACHINE_ATTRIBUTE = 'INSERT INTO machine_attributes (' + ','.join(machine_attributes_fields) + ') VALUES (' + ','.join(['%s'] * len(machine_attributes_fields)) + ');'

CREATE_TABLE_INSTANCE_EVENTS = """
    CREATE TABLE IF NOT EXISTS instance_events (
        time BIGINT,
        type VARCHAR(20),
        collection_id BIGINT,
        scheduling_class VARCHAR(20),
        missing_type VARCHAR(30),
        collection_type VARCHAR(10),
        priority INT,
        alloc_collection_id BIGINT,
        instance_index INT,
        machine_id BIGINT,
        alloc_instance_index INT,
        requested_cpu DOUBLE,
        requested_mem DOUBLE,
        constraints TEXT
    );
"""

instance_events_fields = [
    'time',
    'type',
    'collection_id',
    'scheduling_class',
    'missing_type',
    'collection_type',
    'priority',
    'alloc_collection_id',
    'instance_index',
    'machine_id',
    'alloc_instance_index',
    'requested_cpu',
    'requested_mem',
    'constraints',
]

INSERT_INSTANCE_EVENT = 'INSERT INTO instance_events (' + ','.join(instance_events_fields) + ') VALUES (' + ','.join(['%s'] * len(instance_events_fields)) + ');'

CREATE_TABLE_INSTANCE_USAGE = """
    CREATE TABLE IF NOT EXISTS instance_usage (
        start_time BIGINT,
        end_time BIGINT,
        collection_id BIGINT,
        instance_index INT,
        machine_id BIGINT,
        alloc_collection_id BIGINT,
        alloc_instance_index BIGINT,
        collection_type VARCHAR(10),
        average_cpu DOUBLE,
        average_mem DOUBLE,
        maximum_cpu DOUBLE,
        maximum_mem DOUBLE,
        random_sample_cpu DOUBLE,
        random_sample_mem DOUBLE,
        assigned_memory DOUBLE,
        page_cache_memory DOUBLE,
        cycles_per_instruction DOUBLE,
        memory_accesses_per_instruction DOUBLE,
        sample_rate DOUBLE,
        cpu_usage_distribution TEXT,
        tail_cpu_usage_distribution TEXT
    );
"""

instance_usage_fields = [
    'start_time',
    'end_time',
    'collection_id',
    'instance_index',
    'machine_id',
    'alloc_collection_id',
    'alloc_instance_index',
    'collection_type',
    'average_cpu',
    'average_mem',
    'maximum_cpu',
    'maximum_mem',
    'random_sample_cpu',
    'random_sample_mem',
    'assigned_memory',
    'page_cache_memory',
    'cycles_per_instruction',
    'memory_accesses_per_instruction',
    'sample_rate',
    'cpu_usage_distribution',
    'tail_cpu_usage_distribution',
]

INSERT_INSTANCE_USAGE = 'INSERT INTO instance_usage (' + ','.join(instance_usage_fields) + ') VALUES (' + ','.join(['%s'] * len(instance_usage_fields)) + ');'

# Maps for integer columns to enums

machine_event_type = {
    None: 'unknown',
    '0': 'unknown',
    '1': 'add',
    '2': 'remove',
    '3': 'update',
}

machine_missing_data_reason = {
    None: 'none',
    '0': 'none',
    '1': 'snapshot_but_no_transition',
}

event_type = {
    None: None,
    '0': 'submit',
    '1': 'queue',
    '2': 'enable',
    '3': 'schedule',
    '4': 'evict',
    '5': 'fail',
    '6': 'finish',
    '7': 'kill',
    '8': 'lost',
    '9': 'update_pending',
    '10': 'update_running',
}

latency_sensitivity = {
    None: None,
    '0': 'most_insensitive',
    '1': 'insensitive',
    '2': 'sensitive',
    '3': 'most_sensitive',
}

missing_type = {
    None: 'missing_type_none',
    '0': 'missing_type_none',
    '1': 'snapshot_but_no_transition',
    '2': 'no_snapshot_or_transition',
    '3': 'exists_but_no_creation',
    '4': 'transition_missing_step',
    '5': 'too_many_events',
}

collection_type = {
    None: None,
    '0': 'job',
    '1': 'alloc_set',
}

vertical_scaling = {
    None: None,
    '0': 'vertical_scaling_setting_unknown',
    '1': 'vertical_scaling_off',
    '2': 'vertical_scaling_constrained',
    '3': 'vertical_scaling_fully_automated',
}

scheduler = {
    None: 'scheduler_default',
    '0': 'scheduler_default',
    '1': 'scheduler_batch',
}

# Functions to read json files and insert the data to an sql table

def fill_collection_events(db):
    with open(collection_events_path) as file:
        entities = json.load(file)

    # if you see a field with the name KEY, apply the VALUE function to it
    maps = {
        'type': event_type,
        'scheduling_class': latency_sensitivity,
        'missing_type': missing_type,
        'collection_type': collection_type,
        'vertical_scaling': vertical_scaling,
        'scheduler': scheduler,
    }

    print()
    insert_ready = []
    for i, x in enumerate(entities):
        print("collection_events:" + str(i), end='\r')
        insert_ready.append(deepcopy(x))
        for key,value in x.items():
            # Each json item has to be cleaned up before it's ready to be added to the DB

            # JSON nulls are sometimes mapped to empty lists :(
            if isinstance(value, list) and len(value) == 0:
                insert_ready[-1][key] = None

            if key in maps:
                insert_ready[-1][key] = maps[key][value]
            elif isinstance(value, str) and value.isnumeric():
                insert_ready[-1][key] = int(value)

        # We occasionally commit the parsed json to the DB so we don't use too much RAM
        if i % 100 == 0:
            rows = [ [x.get(field) for field in collection_events_fields ] for x in insert_ready ]
            with db.cursor() as cursor:
                cursor.executemany(INSERT_COLLECTION_EVENT, rows)
            db.commit()
            insert_ready = []

    # Commit the last batch to the DB
    rows = [ [x.get(field) for field in collection_events_fields ] for x in insert_ready ]
    with db.cursor() as cursor:
        cursor.executemany(INSERT_COLLECTION_EVENT, rows)
    db.commit()

def fill_machine_events(db):
    with open(machine_events_path) as file:
        entities = json.load(file)

    maps = {
        'type': machine_event_type,
        'missing_data_reason': machine_missing_data_reason,
    }

    print()
    insert_ready = []
    for i, x in enumerate(entities):
        print("machine_events:" + str(i), end='\r')
        insert_ready.append(deepcopy(x))
        for key,value in x.items():
            if isinstance(value, list) and len(value) == 0:
                insert_ready[-1][key] = None

            if key in maps:
                insert_ready[-1][key] = maps[key][value]
            elif isinstance(value, str) and value.isnumeric():
                insert_ready[-1][key] = int(value)
            elif key == 'capacity':
                # Resources fields contain 2 values (cpu and memory) so we flatten them
                insert_ready[-1]['capacity_cpu'] = float(x[key]['cpus']) if 'cpus' in x[key] else None
                insert_ready[-1]['capacity_mem'] = float(x[key]['memory']) if 'memory' in x[key] else None

        if i % 100 == 0:
            rows = [ [x.get(field) for field in machine_events_fields ] for x in insert_ready ]
            with db.cursor() as cursor:
                cursor.executemany(INSERT_MACHINE_EVENT, rows)
            db.commit()
            insert_ready = []

    rows = [ [x.get(field) for field in machine_events_fields ] for x in insert_ready ]
    with db.cursor() as cursor:
        cursor.executemany(INSERT_MACHINE_EVENT, rows)
    db.commit()

def fill_instance_usage(db):
    with open(instance_usage_path) as file:
        entities = json.load(file)

    maps = {
        'collection_type': collection_type,
    }

    print()
    insert_ready = []
    for i, x in enumerate(entities):
        print("instance_events:" + str(i), end='\r')
        insert_ready.append(deepcopy(x))
        for key,value in x.items():
            if isinstance(value, list) and len(value) == 0:
                insert_ready[-1][key] = None

            if key in maps:
                insert_ready[-1][key] = maps[key][value]
            elif isinstance(value, str) and value.isnumeric():
                insert_ready[-1][key] = int(value)
            elif key == 'constraint':
                insert_ready[-1][key] = json.dumps(x[key])
            elif key == 'average_usage':
                insert_ready[-1]['average_cpu'] = float(x[key]['cpus']) if 'cpus' in x[key] else None
                insert_ready[-1]['average_mem'] = float(x[key]['memory']) if 'memory' in x[key] else None
            elif key == 'maximum_usage':
                insert_ready[-1]['maximum_cpu'] = float(x[key]['cpus']) if 'cpus' in x[key] else None
                insert_ready[-1]['maximum_mem'] = float(x[key]['memory']) if 'memory' in x[key] else None
            elif key == 'random_sample_usage':
                insert_ready[-1]['random_sample_cpu'] = float(x[key]['cpus']) if 'cpus' in x[key] else None
                insert_ready[-1]['random_sample_mem'] = float(x[key]['memory']) if 'memory' in x[key] else None
            elif key == 'cpu_usage_distribution':
                insert_ready[-1][key] = json.dumps(x[key])
            elif key == 'tail_cpu_usage_distribution':
                insert_ready[-1][key] = json.dumps(x[key])

        if i % 100 == 0:
            rows = [ [x.get(field) for field in instance_usage_fields ] for x in insert_ready ]
            with db.cursor() as cursor:
                cursor.executemany(INSERT_INSTANCE_USAGE, rows)
            db.commit()
            insert_ready = []

    rows = [ [x.get(field) for field in instance_usage_fields ] for x in insert_ready ]
    with db.cursor() as cursor:
        cursor.executemany(INSERT_INSTANCE_USAGE, rows)
    db.commit()

def fill_instance_events(db):
    with open(instance_events_path) as file:
        entities = json.load(file)

    maps = {
        'type': event_type,
        'scheduling_class': latency_sensitivity,
        'missing_type': missing_type,
        'collection_type': collection_type,
    }

    print()
    insert_ready = []
    for i, x in enumerate(entities):
        print("instance_events:" + str(i), end='\r')
        insert_ready.append(deepcopy(x))
        for key,value in x.items():
            if isinstance(value, list) and len(value) == 0:
                insert_ready[-1][key] = None

            if key in maps:
                insert_ready[-1][key] = maps[key][value]
            elif isinstance(value, str) and value.isnumeric():
                insert_ready[-1][key] = int(value)
            elif key == 'constraint':
                insert_ready[-1][key] = json.dumps(x[key])
            elif key == 'resource_request':
                insert_ready[-1]['requested_cpu'] = float(x[key]['cpus']) if 'cpus' in x[key] else None
                insert_ready[-1]['requested_mem'] = float(x[key]['memory']) if 'memory' in x[key] else None

        if i % 100 == 0:
            rows = [ [x.get(field) for field in instance_events_fields ] for x in insert_ready ]
            with db.cursor() as cursor:
                cursor.executemany(INSERT_INSTANCE_EVENT, rows)
            db.commit()
            insert_ready = []

    rows = [ [x.get(field) for field in instance_events_fields ] for x in insert_ready ]
    with db.cursor() as cursor:
        cursor.executemany(INSERT_INSTANCE_EVENT, rows)
    db.commit()

def fill_machine_attributes(db):
    with open(machine_attributes_path) as file:
        entities = json.load(file)

    print()
    insert_ready = []
    for i, x in enumerate(entities):
        print("machine_attributes:" + str(i), end='\r')
        insert_ready.append(deepcopy(x))
        for key,value in x.items():
            if isinstance(value, list) and len(value) == 0:
                insert_ready[-1][key] = None

            if isinstance(value, str) and value.isnumeric():
                insert_ready[-1][key] = int(value)

        if i % 100 == 0:
            rows = [ [x.get(field) for field in machine_attributes_fields ] for x in insert_ready ]
            with db.cursor() as cursor:
                cursor.executemany(INSERT_MACHINE_ATTRIBUTE, rows)
            db.commit()
            insert_ready = []

    rows = [ [x.get(field) for field in machine_attributes_fields ] for x in insert_ready ]
    with db.cursor() as cursor:
        cursor.executemany(INSERT_MACHINE_ATTRIBUTE, rows)
    db.commit()

def create_tables(db):
    with db.cursor() as cursor:
        cursor.execute(CREATE_TABLE_INSTANCE_USAGE)
        cursor.execute(CREATE_TABLE_INSTANCE_EVENTS)
        cursor.execute(CREATE_TABLE_COLLECTION_EVENTS)
        cursor.execute(CREATE_TABLE_MACHINE_EVENTS)
        cursor.execute(CREATE_TABLE_MACHINE_ATTRIBUTES)

def drop_tables(db):
    with db.cursor() as cursor:
        cursor.execute('DROP TABLE IF EXISTS collection_events')
        cursor.execute('DROP TABLE IF EXISTS machine_events')
        cursor.execute('DROP TABLE IF EXISTS machine_attributes')
        cursor.execute('DROP TABLE IF EXISTS instance_events')
        cursor.execute('DROP TABLE IF EXISTS instance_usage')

def fill_tables(db):
    fill_instance_usage(db)
    fill_instance_events(db)
    fill_collection_events(db)
    fill_machine_events(db)
    fill_machine_attributes(db)

if __name__ == '__main__':
    try:
        db = mysql.connector.connect(**db_config)

        if '--drop' in sys.argv:
            drop_tables(db)
        create_tables(db)
        fill_tables(db)

    except Error as e:
        print("Error:", e)
    finally:
        if db.is_connected():
            db.close()

