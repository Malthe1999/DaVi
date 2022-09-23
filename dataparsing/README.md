# Script to populate an SQL DB

## Run
```
python fill.py --drop
```

The `--drop` option is optional and will drop all tables before inserting the data. It's useful if you need to refresh the state of the DB.

## Config

The `fill.py` file starts with a few config variables:

- `db_config`: contains the database connection params. The default values are (localhost, borg, user, pass)
- `<table_name>_path`: path to the json file containing the data for `<table_name>`. By default the files are in the current working directory
