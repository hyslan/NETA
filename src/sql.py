import os
import subprocess
import sqlalchemy as sa
import pandas as pd
import numpy as np
from rich.console import Console
from tqdm import tqdm
from dotenv import load_dotenv

console = Console()
load_dotenv()

connection_url = sa.URL.create(
    "mssql+pyodbc",
    username=os.environ["USR_BD"],
    password=os.environ["PWD_BD"],
    host=os.environ["HOST"],
    database=os.environ["DB"],
    query={"driver": "ODBC Driver 18 for SQL Server",
           "TrustServerCertificate": "yes"
           },
)


def connect_sql(df: pd.DataFrame) -> None:
    """Insert and update data in SQL Server database."""
    engine = sa.create_engine(connection_url, connect_args={"timeout": 900})
    cnn = engine.connect()
    # Insert
    chunk_size = 1000
    tqdm_iter = tqdm(range(0, len(df), chunk_size),
                     desc="Inserido no banco de dados ML", unit="chunk")
    sql_table = "tb_Fato_Neta_Prov"
    proc = "EXEC [BD_ML].[LESTE_AD\\CargaDeDados].[sp_Carga_Neta]"
    # Escreve o DataFrame em pedaços na tabela SQL
    for start in tqdm_iter:
        end = start + chunk_size
        df_chunk = df.iloc[start:end]
        df_chunk.to_sql(sql_table, cnn,
                        if_exists='append',
                        index=False,
                        schema="LESTE_AD\\CargadeDados"
                        )

    # Executa o procedimento armazenado
    with console.status("\n[bold blue] Executing procedure..."):
        try:
            # Call Csharp
            subprocess.run(
                [os.getcwd() + "/InsertSql/InsertSql/bin/Release/net8.0/InsertSql.exe"])
            console.print("[bold margente] End of the process!")
        except Exception as e:
            console.print(f"Erro ao executar CSharp: {e}")
            return


def get_csv(file):
    console.print(f"Reading file {file}")
    df = pd.read_csv(file, encoding='latin-1', sep=';', dtype=str)
    df.replace(np.nan, '', inplace=True)
    selected_columns = df.columns[:49]
    selected_df = df[selected_columns]
    return selected_df
