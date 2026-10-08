using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for rwOrderItems
/// </summary>
public class rwOrderItems
{
    private string _numOrderItemsCode;
    private string _strOrderRef;

    private int _numSalesGoodPrice;
    private int _numGoodRef;
    private string _numGoodAmount;
    private string _strGoodName;
    private int _numTotalPrice;

    public rwOrderItems(string OrderItemsCode, string OrderRef, int SalesGoodPrice, int GoodRef, string GoodAmount, string GoodName, int TotalPrice)
    {
        numOrderItemsCode = OrderItemsCode;
        strOrderRef = OrderRef;
        numSalesGoodPrice = SalesGoodPrice;
        numGoodRef = GoodRef;
        numGoodAmount = GoodAmount;
        strGoodName = GoodName;
        numTotalPrice = TotalPrice;
       
    }

   

    public rwOrderItems()
    {
    }
    public int numTotalPrice
    {
        set
        {
            _numTotalPrice = value;
        }
        get
        {
            return _numTotalPrice;
        }
    }
    public string numOrderItemsCode
    {
        set
        {
            _numOrderItemsCode = value;
        }
        get
        {
            return _numOrderItemsCode;
        }
    }
    public string strOrderRef
    {
        set
        {
            _strOrderRef = value;
        }
        get
        {
            return _strOrderRef;
        }
    }
    public int numGoodRef
    {
        set
        {
            _numGoodRef = value;
        }
        get
        {
            return _numGoodRef;
        }
    }
    public string numGoodAmount
    {
        set
        {
            _numGoodAmount = value;
        }
        get
        {
            return _numGoodAmount;
        }
    }


    public int numSalesGoodPrice
    {
        set
        {
            _numSalesGoodPrice = value;
        }
        get
        {
            return _numSalesGoodPrice;
        }
    }
    public string strGoodName
    {
        set
        {
            _strGoodName = value;
        }
        get
        {
            return _strGoodName;
        }
    }
  
 
 
  
    
}
