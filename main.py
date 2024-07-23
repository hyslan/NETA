#!/usr/bin/env python3
import src.manager as manager
import src.sql as sql


def main():
    print("Running python Script")
    file = manager.rename_file()
    df = sql.get_csv(file)
    sql.connect_sql(df)
    manager.manager()
    manager.delete_files()


if __name__ == '__main__':
    main()
