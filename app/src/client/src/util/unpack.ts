function unpack(rows: any, key: any) {
  return rows.map((row: any) => {
    return row[key];
  });
}

export { unpack };
