// SPDX-License-Identifier: MIT
// 合约地址： 0x1b05Db00DeBF217Fa7E65a90e1f5e6855D645Bcb
pragma solidity ^0.8.19;

contract RPS {
    enum Move { None, Rock, Paper, Scissors }
    enum State { WaitingCommit, WaitingReveal, Finished }

    struct Game {
        address creator;
        address opponent;
        uint256 bet;
        bytes32 commit1;
        bytes32 commit2;
        Move reveal1;
        Move reveal2;
        string salt1;
        string salt2;
        State state;
        bool exists;
    }

    mapping(uint256 => Game) public games;
    uint256 public nextGameId;

    event GameCreated(uint256 gameId, address indexed creator, address indexed opponent, uint256 bet);
    event Commit(uint256 gameId, address indexed player);
    event Reveal(uint256 gameId, address indexed player, Move move);

    function createGame(address _opponent) external payable {
        require(msg.value > 0, "Must bet ETH");

        games[nextGameId] = Game({
            creator: msg.sender,
            opponent: _opponent,
            bet: msg.value,
            commit1: 0x0,
            commit2: 0x0,
            reveal1: Move.None,
            reveal2: Move.None,
            salt1: "",
            salt2: "",
            state: State.WaitingCommit,
            exists: true
        });

        emit GameCreated(nextGameId, msg.sender, _opponent, msg.value);
        nextGameId++;
    }

    function commit(uint256 gameId, bytes32 _commit) external payable {
        Game storage game = games[gameId];
        require(game.exists, "Game not found");
        require(game.state == State.WaitingCommit, "Not in commit phase");

        if (msg.sender == game.creator) {
            require(game.commit1 == 0x0, "Already committed");
            game.commit1 = _commit;
        } else if (msg.sender == game.opponent) {
            require(game.commit2 == 0x0, "Already committed");
            require(msg.value == game.bet, "Must match bet");
            game.commit2 = _commit;
        } else {
            revert("Not a participant");
        }

        emit Commit(gameId, msg.sender);

        if (game.commit1 != 0x0 && game.commit2 != 0x0) {
            game.state = State.WaitingReveal;
        }
    }

    function reveal(uint256 gameId, Move _move, string memory _salt) external {
        Game storage game = games[gameId];
        require(game.state == State.WaitingReveal, "Not in reveal phase");
        require(_move == Move.Rock || _move == Move.Paper || _move == Move.Scissors, "Invalid move");

        bytes32 hash = keccak256(abi.encodePacked(_move, _salt));

        if (msg.sender == game.creator) {
            require(game.reveal1 == Move.None, "Already revealed");
            require(hash == game.commit1, "Hash mismatch");
            game.reveal1 = _move;
            game.salt1 = _salt;
        } else if (msg.sender == game.opponent) {
            require(game.reveal2 == Move.None, "Already revealed");
            require(hash == game.commit2, "Hash mismatch");
            game.reveal2 = _move;
            game.salt2 = _salt;
        } else {
            revert("Not a participant");
        }

        emit Reveal(gameId, msg.sender, _move);

        if (game.reveal1 != Move.None && game.reveal2 != Move.None) {
            resolve(gameId);
        }
    }

    function resolve(uint256 gameId) internal {
        Game storage game = games[gameId];
        game.state = State.Finished;

        Move m1 = game.reveal1;
        Move m2 = game.reveal2;
        uint256 total = game.bet * 2;

        address payable p1 = payable(game.creator);
        address payable p2 = payable(game.opponent);

        if (m1 == m2) {
            p1.transfer(game.bet);
            p2.transfer(game.bet);
        } else if (
            (m1 == Move.Rock && m2 == Move.Scissors) ||
            (m1 == Move.Paper && m2 == Move.Rock) ||
            (m1 == Move.Scissors && m2 == Move.Paper)
        ) {
            p1.transfer(total);
        } else {
            p2.transfer(total);
        }
    }
}
