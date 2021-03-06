import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import Card from "./Card";
import axios from "axios";
import { AuthContext } from "../context/contexto";
import { connectEthereum } from "../ethereum";
import { ethers } from "ethers";

export const Container = styled.div`
  grid-area: main;
  background-color: #31373f;
  /* height: 100vh calc(100vh - 70px); */
  height: fit-content;
  min-height: calc(100vh - 70px);

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
`;

const Main = () => {
  const { myCards, setMyCards, event } = useContext(AuthContext);

  useEffect(() => {
    loadData();
  }, [event]);

  const loadData = async () => {
    setMyCards([]);
    const { account, soccerContract, signer, provider } =
      await connectEthereum();

    const val = Number(ethers.utils.parseUnits("0.0000001", "ether"));
    const balance = Number(await soccerContract.balanceOf(account));

    for (let i = 0; i < balance; i++) {
      const tokenRealId = Number(
        await soccerContract.tokenOfOwnerByIndex(account, i)
      );

      // const token = Number(await soccerContract.tokenByIndex(tokenRealId));

      //   const balanceUser = await cards.methods.balanceOf(account).call();
      // console.log(`balance user: ${balanceUser}`);
      // for (let i = 0; i < balanceUser; i++) {
      //   const tokenId = await cards.methods
      //     .tokenOfOwnerByIndex(account, i)
      //     .call();
      //   const token = await cards.methods.tokenByIndex(tokenId).call();
      //   const item = await cards.methods.myCards(account, token).call();

      //   setMyCards((myCards) => [...myCards, item]);
      // }

      const tokenURI = await soccerContract.tokenURI(tokenRealId);

      const { data } = await axios.get(`${tokenURI}`);

      const cardInfo = await soccerContract.cards(tokenRealId);

      const key = Object.keys(cardInfo);
      const values = Object.values(cardInfo);

      //concatenating more data, json data + blockchain data
      for (let j = 6; j <= 11; j++) {
        data[key[j]] = values[j];
      }

      setMyCards((setMyCards) => [...setMyCards, data]);
    }
  };

  return (
    <Container>
      {myCards.map((item, key) => {
        // return <div key={key}>Q</div>;
        return <Card key={key} nft={item} fromPage={"main"}></Card>;
      })}
    </Container>
  );
};

export default Main;
