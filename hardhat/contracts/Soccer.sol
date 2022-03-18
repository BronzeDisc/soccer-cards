//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract Soccer is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => address) public cardCreator;
    mapping(uint256 => CardStruct) cards;
    struct CardStruct {
        uint256 id;
        uint256 createdAt;
        address owner;
        address creator;
        uint256 totalAmount;
    }

    address payable immutable owner;
    mapping(address => bool) public admins;
    uint256 CONTRACT_FEE = 100; //1.0%

    constructor() ERC721("Soccer Cards", "SOKR") {
        owner = payable(msg.sender);
    }

    function mint(string memory tokenURI, uint256 amount) public {
        require(
            owner == msg.sender || admins[msg.sender],
            "You are not allowed to mint a card, because you are not an admin or the owner"
        );

        for (uint256 i = 0; i < amount; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();

            _mint(address(this), newItemId);
            _setTokenURI(newItemId, tokenURI);

            //card creator
            cardCreator[newItemId] = msg.sender;

            CardStruct memory card = CardStruct({
                id: newItemId,
                createdAt: block.timestamp,
                owner: address(this),
                creator: msg.sender,
                totalAmount: amount
            });

            cards[newItemId] = card;
        }
    }

    // adding card creators, just admin allowed to add
    function addCreator(address addr) external {
        require(owner == msg.sender, "YOU ARE NOT ADMIN");
        require(!admins[addr], "This address is an admin already!");
        admins[addr] = true;
    }

    function buyCardFromMarket(uint256 id) public payable {}

    //100 basis points = 1.00 pct
    function calculateFeeAdmin(uint256 amount) private view returns (uint256) {
        require((amount / 10000) * 10000 == amount, "too small");
        return (amount * CONTRACT_FEE) / 10000;
    }
}

//  function mintCards(
//         string memory _title,
//         uint256 _price,
//         string memory _description,
//         string memory _club,
//         string memory _urlPicture,
//         uint256 _totalAmount
//     ) external {
//         require(creators[msg.sender], "YOU ARE NOT A CREATOR");
//         require(
//             clubToCreator[_club] == msg.sender || admin == msg.sender,
//             "YOU ARE NOT CREATOR OF THIS CLUB"
//         );

//         for (uint256 i = 0; i < _totalAmount; i++) {
//             //
//             Card memory card = Card({
//                 title: _title,
//                 id: nextItemId,
//                 owner: address(this),
//                 price: _price,
//                 description: _description,
//                 urlPicture: _urlPicture,
//                 club: _club,
//                 timestamp: block.timestamp,
//                 createdBy: msg.sender,
//                 totalAmount: _totalAmount
//             });

//             _mint(address(this), nextItemId.current());
//             marketCards[address(this)][nextItemId.current()] = card;
//             _setTokenURI(nextItemId.current(), _urlPicture);
//             nextItemId.increment();

//             //      _tokenIds.increment();

//             // uint256 newItemId = _tokenIds.current();
//             // _mint(owner(), newItemId);
//             // _setTokenURI(newItemId, tokenURI);

//             // _setTokenURI(nextItemId, _tokenURI);
//             // _setTokenURI(nextItemId.current(), _urlPicture); //ipfs or pinata address

//             emit cardMinted(
//                 card.id,
//                 card.owner,
//                 card.timestamp,
//                 card.title,
//                 card.price,
//                 card.description,
//                 card.urlPicture,
//                 card.totalAmount,
//                 card.createdBy
//             );
//         }

//         // tokenOfOwnerByIndex(owner, index);
//         // tokenByIndex(index);
//     }