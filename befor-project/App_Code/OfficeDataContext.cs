using System.Data.Linq;
using System.Data.Linq.Mapping;
using System.Reflection;

/// <summary>
/// Summary description for OfficeDataContext
/// </summary>
public partial class OfficeDataContext : System.Data.Linq.DataContext
{
    [Function(Name = "GetInfoContractForPrint")]
    [ResultType(typeof(rwInfoContract1))]
    [ResultType(typeof(rwInfoContract2))]
    [ResultType(typeof(rwInfoContract3))]
    [ResultType(typeof(rwInfoContract4))]
    [ResultType(typeof(rwInfoContract5))]
    [ResultType(typeof(rwZemanatInfoAll))]
    [ResultType(typeof(rwZemanatCheckDetails))]
    [ResultType(typeof(rwZemanatSaftehDetails))]
    [ResultType(typeof(rwPriceContract))]
    public IMultipleResults GetInfoContractForPrint([global::System.Data.Linq.Mapping.ParameterAttribute(DbType = "nvarchar(500)")] string numContractCode, [global::System.Data.Linq.Mapping.ParameterAttribute(DbType = "Int")] System.Nullable<int> type )
    {
        IExecuteResult result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), numContractCode, type);
        return (IMultipleResults)result.ReturnValue;
    }

}