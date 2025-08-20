// SPDX-License-Identifier: MIT
// 合约地址：0x51d37b7fC59a53E5b198e1B76050cC0E34f93781
pragma solidity ^0.8.0;

contract RockPaperScissors {
    // 枚举出拳动作
    enum Move { Rock, Paper, Scissors }
    enum Result { Draw, UserWin, ContractWin }

    address public owner;
    uint public minimumBet = 0.00001 ether;  // 最低下注金额

    // 奖池余额
    uint public prizePool;

    // 事件
    event GameResult(address indexed user, Move userMove, Move contractMove, Result result, uint amountWon);

    constructor() {
        owner = msg.sender;
    }

    // 任何人都可以向奖池存款
    function depositPrizePool() external payable {
        require(msg.value > 0, "Must send 0g");
        prizePool += msg.value;
    }

    // 用户出拳并下注
    function playGame(Move userMove) external payable {
        require(msg.value >= minimumBet, "Bet too low");
        require(prizePool >= msg.value * 2, "Prize pool insufficient");

        prizePool += msg.value;  // 用户下注加入奖池

        // 生成伪随机合约出拳（链上伪随机，不完全安全，学习用）
        uint random = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.difficulty))) % 3;
        Move contractMove = Move(random);

        Result result;
        uint amountWon = 0;

        if (userMove == contractMove) {
            // 平局，退还下注
            payable(msg.sender).transfer(msg.value);
            prizePool -= msg.value;
            result = Result.Draw;
        } else if (
            (userMove == Move.Rock && contractMove == Move.Scissors) ||
            (userMove == Move.Paper && contractMove == Move.Rock) ||
            (userMove == Move.Scissors && contractMove == Move.Paper)
        ) {
            // 用户赢，赢得双倍下注
            amountWon = msg.value * 2;
            require(prizePool >= amountWon, "Prize pool insufficient");
            prizePool -= amountWon;
            payable(msg.sender).transfer(amountWon);
            result = Result.UserWin;
        } else {
            // 合约赢，下注归奖池
            result = Result.ContractWin;
        }

        emit GameResult(msg.sender, userMove, contractMove, result, amountWon);
    }

    // 奖池提现（只有合约拥有者可以）
    function withdrawPrizePool(uint amount) external {
        require(msg.sender == owner, "Only owner");
        require(amount <= prizePool, "Amount too big");
        prizePool -= amount;
        payable(owner).transfer(amount);
    }

    // 合约接收0g
    receive() external payable {
        prizePool += msg.value;
    }
}
