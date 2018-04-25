pragma solidity ^0.4.2;

contract Product{
//Model a Product
//Store Products
// Fetch Products

struct product{
    uint id;
    string name;
    string qrCode;
    bool soldStatus;
}
string productIdentity;

mapping(bytes32 => product) public products;
uint public productCount;

function Product() public{
   
   addProduct("Iphone8","AP8989",false);
   addProduct("Iphone10","AP8980",false);
   addProduct("Iphone7","AP8970",false);
   addProduct("Iphone6","AP8960",false);
   addProduct("Samsung1","SA8980",false);
   addProduct("Samsung2","SA8980",false);
}

function addProduct(string _name,string _qrCode,bool _status) private{

    productCount++;
    products[keccak256(_qrCode)]=product(productCount,_name,_qrCode,_status) ;

}



 // voted event
    event buyEvent (
        uint indexed _productId
    );

function buy (uint _productId) public {
        
       // require(!products[_productId].soldStatus);

        // update product status
      //  products[_productId].soldStatus = true;

        // trigger voted event
        buyEvent(_productId);
    }

 
function checkProduct(bytes32 _productCode) returns (string){
   // if(products[_productCode].qrCode)
//   if(_answer == keccak256("hello")){
       // isAnswered = true;
      //  winner = msg.sender;
    //    return "RIGHT";
  //  }
  //  return "WRONG";
    return products[_productCode].name;
    }

function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
    for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
    for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
    return string(babcde);
}

function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
    return strConcat(_a, _b, _c, _d, "");
}

function strConcat(string _a, string _b, string _c) internal returns (string) {
    return strConcat(_a, _b, _c, "", "");
}

function strConcat(string _a, string _b) internal returns (string) {
    return strConcat(_a, _b, "", "", "");
}

function compareStrings (string a, string b) view returns (bool){
       return keccak256(a) == keccak256(b);
   }
}
