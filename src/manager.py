import glob
import os
import shutil
from datetime import date, timedelta


def manager() -> None:
    try:
        today = date.today()
        path_name = today.strftime("%Y-%m-%d")
        destination_path = os.path.join(
            r"\\6522830929olmp\Diretório Guardiões\ARQUIVOS CARGA\NETA",
            path_name)
        files = glob.glob(os.getcwd() + "\\data" + "\\*.CSV")
        if not os.path.exists(destination_path):
            os.makedirs(destination_path)
            print(f"Created path: {destination_path}")
        else:
            print(f"Path already exists: {destination_path}")

        for file in files:
            filename = os.path.basename(file)
            shutil.move(file, os.path.join(destination_path, filename))
            print(f"File {filename} moved to {destination_path}")
    except Exception as e:
        print(e)
        print("Erro ao mover xlsx files")


def delete_files() -> None:
    try:
        files_csv = glob.glob(os.getcwd() + "\\data" + "\\*.CSV")
        for file in files_csv:
            os.remove(file)
            print(f"File {file} deleted.")

        files_zip = glob.glob(os.getcwd() + "\\zip" + "\\*.ZIP")
        for file in files_zip:
            os.remove(file)
            print(f"File {file} deleted.")
    except Exception as e:
        print(e)
        print("Erro ao deletar xlsx files")


def rename_file() -> str:
    today: date = date.today()
    seven_days: date = today - timedelta(days=7)
    today_str: str = today.strftime("%d_%m_%Y")
    seven_days_str: str = seven_days.strftime("%d_%m_%Y")
    delta = "N1N@_" + seven_days_str + "_" + today_str
    old = os.path.join(os.getcwd(), "data", "ESTRATTORE_PROCESSI.CSV")
    new_file = os.path.join(os.getcwd(), "data", f"{delta}.CSV")
    os.rename(old, new_file)
    return new_file
