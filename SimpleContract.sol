pragma solidity ^0.4.19;

contract SimpleContract {
  uint public val = 4;

  function increment(uint amt) public {
    val += amt;
  }

  function get() public constant returns (uint) {
    return  val;
  }
}
