// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

pragma solidity ^0.8.20;

contract CreditScoreDelegation is ReentrancyGuard {
    // Mapping minimum credit score the delegator requires from the delegatee
    mapping(address => uint) private _minimumCreditScore;

    // Mapping of the credit score of the delegatee
    mapping(address => uint) private _creditScore;

    // Mapping max borrow amount of which token the delegator allows the delegatee to borrow
    // E.g., maxBorrowAmount[delegatorAddress][tokenAddress] = 1000000000000000000 means the delegator allows the delegatee to borrow maximum 1 of the token specified
    mapping(address => mapping(address => uint)) private _maxBorrowAmount;

    // Mapping of Number of times the delegatee has borrowed and hasn't repaid
    mapping(address => uint) private _activeBorrows;

    // Mapping of number of times the delegatee has repaid
    mapping(address => uint) private _repayCount;

    // Mapping of active delegation requests. 
    // E.g., _activeDelegationRequests[delegatorAddress][tokenAddress][delegateeAddress] = 1000000000000000000 means the delegatee has requested to borrow 1 of the token 
    // specified by tokenAddress from the delegator specified by delegatorAddress
    mapping(address => mapping(address => mapping(address => uint))) private _activeDelegationRequests;

    // Mapping of active delegations.
    // E.g., _activeDelegations[delegatorAddress][tokenAddress][delegateeAddress] = 1000000000000000000 means the delegator has delegated 1 of the token specified by tokenAddress
    // to the delegatee specified by delegateeAddress
    mapping(address => mapping(address => mapping(address => uint))) private _activeDelegations;

    // Mapping of active delegators.
    mapping (address => bool) private _activeDelegators;

    // Mapping of users _points for future rewards
    mapping (address => uint) private _points;

    event BorrowRequested(address indexed delegator, address indexed delegatee, address indexed token, uint amount);

    event RepaidBorrow(address indexed delegator, address indexed delegatee, address indexed token, uint amount);

    function calculateAddedCreditScore(address delegatee) internal view returns (uint) {
        uint maxAddedCreditScore = 1000 - _creditScore[delegatee]; // max credit score is 1000

        uint addedCreditScore = 0;
       
        addedCreditScore += (_repayCount[delegatee] + 1) * 20; // adding 20 credit score per previous repayment and the current repayment (i.e., _repayCount[delegatee] + 1)       

        return addedCreditScore > maxAddedCreditScore ? maxAddedCreditScore : addedCreditScore; // minimum between addedCreditScore and maxAddedCreditScore
    }

    function calculateRemovedCreditScore(address delegatee) internal view returns(uint){
        uint maxRemovedCreditScore = _creditScore[delegatee]; // min credit score is 0

        uint removedCreditScore = 0;

        if (_activeBorrows[delegatee] > 0) {
            removedCreditScore += (_activeBorrows[delegatee]) ; // removing 1 credit for each active borrow 
        }

        // minimum between removedCreditScore and maxRemovedCreditScore
        return removedCreditScore > maxRemovedCreditScore ? maxRemovedCreditScore : removedCreditScore;
    }

    function setDelegateeCreditScore(address delegatee, uint score) internal {
        _creditScore[delegatee] = score;
    }

    function activateDelegator(bool active) public {
        _activeDelegators[msg.sender] = active;
    }

    function activateDelegatee() public {
        require(_creditScore[msg.sender] == 0, "Delegatee is already active");

        _creditScore[msg.sender] = 500;
    }

    function setDelegatorMaxBorrowAmount(address token, uint amount) public {
        // TODO: Add check if the delegator is actually supplying the token on Aave 
        if(amount > 0){
            _activeDelegators[msg.sender] = true;
        }
        else {
            _activeDelegators[msg.sender] = false;
        }

        _maxBorrowAmount[msg.sender][token] = amount;
    }

    // The delegator can set the minimum credit score required from the delegatee
    function setDelegatorMinimumCreditScore(uint score) public {
        require(score >= 0 && score <= 1000, "Credit score must be between 0 and 1000");
        require(_activeDelegators[msg.sender], "Delegator is not active");
        require(score != _minimumCreditScore[msg.sender], "Credit score is already set to the specified value");

        _points[msg.sender] += 1;
        
        _minimumCreditScore[msg.sender] = score;
    }

    // The delegatee can request to borrow from the delegator
    function requestDelegation(address delegator, address token, uint amount) public {
        // Zero address checks
        require(delegator != address(0), "Delegator address cannot be zero");
        require(token != address(0), "Token address cannot be zero");
        require(amount > 0, "Amount must be greater than zero");

        require(_creditScore[msg.sender] >= _minimumCreditScore[delegator], "Delegatee's credit score is lower than the minimum required by the delegator");
        require(_maxBorrowAmount[delegator][token] >= amount, "Delegator's max borrow amount is lower than the requested amount");
        require(_activeDelegators[delegator], "Delegator is not active");
        require(_activeDelegations[delegator][msg.sender][token] == 0, "Delegator has already delegated the specified token to the delegatee");
        
        _activeDelegationRequests[delegator][token][msg.sender] = amount;

        _points[msg.sender] += 1;

        emit BorrowRequested(delegator, msg.sender, token, amount);
    }

    // Why would the delegatee confirm he borrowed? 
    // Because otherwise he won't be counted in the credit score and he won't qualify to delgators that require a higher credit score than the default 500.
    // Also he wouldn't increment his _points for future rewards
    function confirmBorrow(address delegator, address token, uint amount) nonReentrant public {
        // TODO: Verify with Aave contracts if the delegatee has borrowed the token and amount passed
        _activeBorrows[msg.sender] += 1;

        _activeDelegationRequests[delegator][msg.sender][token] = 0; // set the active delegation request back to 0, due to the approval demonstrated by the event emitted below
        _activeDelegations[delegator][msg.sender][token] = amount;

        _points[msg.sender] += 10;
        _points[delegator] += 5;
    }

    // Why would the delegatee confirm he repaid?
    // Because otherwise he won't be counted in the credit score and he won't qualify to delgators that require a higher credit score than the default 500.
    // Also he wouldn't increment his _points for future rewards 
    function confirmRepay(address delegator, address token, uint amount) nonReentrant public {
        require(_activeDelegations[delegator][msg.sender][token] > 0, "No active delegation for the specified delegator, delegatee and token");

        // TODO: Verify with Aave contracts if the delegatee has repaid the token and amount passed

        uint addedCreditScore = calculateAddedCreditScore(msg.sender);
        uint removedCreditScore = calculateRemovedCreditScore(msg.sender);

        uint totalCredit = addedCreditScore - removedCreditScore;

        setDelegateeCreditScore(msg.sender, _creditScore[msg.sender] + totalCredit);

        _activeBorrows[msg.sender] -= 1;
        _repayCount[msg.sender] += 1;
        _activeDelegations[delegator][msg.sender][token] = 0;

        _points[msg.sender] += totalCredit > 0 ? (totalCredit * 10)+ 10 : 10;
        _points[delegator] += 100;

        emit RepaidBorrow(delegator, msg.sender, token, amount);
    }

    // The delegatee calls this function to know if he can borrow from the delegator the specified amount of the specified token
    function isCompatibleForBorrow(address delegator, address token, uint amount) public view returns (bool) {
        return _minimumCreditScore[delegator] <= _creditScore[msg.sender] && _maxBorrowAmount[delegator][token] >= amount;
    }

    // ------------------ Getters ------------------ //

    // Minimum credit score the delegator requires from the delegatee
    function getMinimumCreditScore(address delegator) public view returns (uint) {
        return _minimumCreditScore[delegator];
    }

    function getCreditScore(address delegatee) public view returns (uint) {
        return _creditScore[delegatee];
    }

    // Max borrow amount of which token the delegator allows the delegatee to borrow
    function getMaxBorrowAmount(address delegator, address token) public view returns (uint) {
        return _maxBorrowAmount[delegator][token];
    }

    // Number of times the delegatee has borrowed and hasn't repaid
    function getActiveBorrows(address delegatee) public view returns (uint) {
        return _activeBorrows[delegatee];
    }

    // Number of times the delegatee has repaid
    function getRepayCount(address delegatee) public view returns (uint) {
        return _repayCount[delegatee];
    }

    // Get the active delegation requests from delegatees to delegators for the specified token. Returns the amount of the token requested
    function getActiveDelegationRequests(address delegator, address token, address delegatee) public view returns (uint) {
        return _activeDelegationRequests[delegator][token][delegatee];
    }

    // Get the active delegations from delegators to delegatees for the specified token. Returns the amount of the token delegated
    function getActiveDelegations(address delegator, address token, address delegatee) public view returns (uint) {
        return _activeDelegations[delegator][token][delegatee];
    }

    // Get users _points for future rewards
    function getPoints(address user) public view returns (uint) {
        return _points[user];
    }
}