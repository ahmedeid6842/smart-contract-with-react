pragma solidity ^0.4.17;

contract CampignFactory{
    address[] public deployedCampaign;
    
    function createCampign(uint minimum) public{
        address newCampign = new Campign(minimum,msg.sender);
        deployedCampaign.push(newCampign);
    }
    
    function getDeployedCamapigns() public view returns (address[]){
        return deployedCampaign;
    }
}

contract Campign {
    
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address =>bool) approvals;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    function Campign(uint minimum,address creator) public{
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable{
        require(msg.value>minimumContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    } 
    
    function createRequest(string description,uint value,address recipient) public restricted{
        Request memory newRequest= Request({
            description:description,
            value:value,
            recipient:recipient,
            complete:false,
            approvalCount:0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public{
        Request storage request= requests[index];
        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);
        
        request.approvals[msg.sender]=true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request=requests[index];
        
        require(request.approvalCount > (approversCount/2));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        request.complete=true;
    }

    function getSummary() public view returns(
        uint,uint,uint,uint,address
    ){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }
    function getRequestsCount() public view returns(uint){
        return requests.length;       
    }
}