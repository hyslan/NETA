using ClassSql;
using System.Data;
using System.Data.SqlClient;

// PROCEDURE:
namespace InsertSql
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Cls_Connection conObj = new Cls_Connection();
            using (SqlConnection cn = conObj.BD_ML())
            {
                cn.Open();
                try
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string nomeProcedure = @"[BD_ML].[LESTE_AD\CargaDeDados].[sp_Carga_Neta]";
                        Console.WriteLine("Iniciando Procedure...");
                        da.SelectCommand = new SqlCommand(nomeProcedure, cn)
                        {
                            CommandType = CommandType.StoredProcedure,
                            CommandTimeout = 900 // Definindo o timeout para 180 segundos
                        };
                        da.SelectCommand.ExecuteNonQuery();
                        Console.WriteLine("Executou a Procedure - Por Dentro");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Erro ao executar a procedure: " + ex.Message);
                }
                finally
                {
                    cn.Close();
                }

                Console.WriteLine($@"CONCLUÍDA A PROCEDURE!");
            }
        }

    }
}