using System;
using System.Data.SqlClient;

namespace ClassSql
{
    public class Cls_Connection
    {
        private static string server = @"10.66.9.46";
        private static string dataBase = "BD_ML";
        private static string user = "BD_ML_SERVICE";
        private static string password = "S@besp&2024*";

        public SqlConnection BD_ML()
        {
            string conString = $"Data Source={server};Initial Catalog={dataBase};User ID={user};Password={password};Integrated Security=False;";
            SqlConnection cn = new SqlConnection(conString);
            return cn;
        }
    }
}
