import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-scroll';
import {
  sidePanelRightMed,
  sidePanelRightMedWhite,
  sidePanelLeftMed,
  sidePanelLeftMedWhite,
} from '../../assets/images';
import { smColors } from '../../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 250px;
  height: 190px;
  margin-right: 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.black10Alpha};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const SideBar = styled.img<{ isLeft: boolean }>`
  display: block;
  width: 13px;
  height: 100%;

  ${({ theme, isLeft }) => `
    border-top-left-radius: ${isLeft ? theme.box.radius : 0}px;
    border-top-right-radius: ${isLeft ? 0 : theme.box.radius}px;
    border-bottom-left-radius: ${isLeft ? theme.box.radius : 0}px;
    border-bottom-right-radius: ${isLeft ? 0 : theme.box.radius}px;
  `};
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 25px 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.black10Alpha};
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ isCurrent, theme }) => {
    if (!isCurrent) {
      return theme.isDarkMode ? smColors.white : smColors.realBlack;
    } else {
      return smColors.purple;
    }
  }};
  font-weight: ${({ isCurrent }) => (isCurrent ? 400 : 800)};
  text-align: right;
  cursor: pointer;

  .active & {
    font-family: SourceCodeProBold;
    color: ${smColors.purple};
  }
`;

const Indicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 10px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.white};
  font-size: 11px;
  background-color: ${({ theme: { isDarkMode } }) =>
    isDarkMode ? smColors.white : smColors.realBlack};
  cursor: pointer;

  .active & {
    background-color: ${smColors.purple};
  }
`;

const Container = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
  ${({ theme }) => `border-radius: ${theme.indicators.radius}px;`}
`;

type Props = {
  items: Array<string>;
  isDarkMode?: boolean;
};

const SideMenu = ({ items, isDarkMode }: Props) => {
  const leftImg = isDarkMode ? sidePanelLeftMedWhite : sidePanelLeftMed;
  const rightImg = isDarkMode ? sidePanelRightMedWhite : sidePanelRightMed;
  return (
    <Wrapper>
      <SideBar src={leftImg} isLeft />
      <InnerWrapper>
        {items.map((item, index) => (
          <Container
            to={item}
            activeClass="active"
            spy
            smooth
            key={item}
            containerId="settingsContainer"
          >
            <Text>{item}</Text>
            <Indicator>{index + 1}</Indicator>
          </Container>
        ))}
      </InnerWrapper>
      <SideBar src={rightImg} isLeft={false} />
    </Wrapper>
  );
};

export default SideMenu;
