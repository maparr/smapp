import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { CorneredContainer, BackButton } from '../../components/common';
import { Button, Link, DropDown } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { AppThDispatch, RootState } from '../../types';
import { setUiError } from '../../redux/ui/actions';
import { SocketAddress } from '../../../shared/types';
import { stringifySocketAddress } from '../../../shared/utils';
import { switchApiProvider } from '../../redux/wallet/actions';
import { getNetworkId } from '../../redux/network/selectors';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { AuthRouterParams } from './routerParams';
import Steps, { Step } from './Steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const RowColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

type PublicServicesView = {
  label: string;
  value?: SocketAddress;
  text?: string;
  isDisabled?: boolean;
};

const ConnectToApi = ({ history, location }: AuthRouterParams) => {
  const dispatch: AppThDispatch = useDispatch();
  const curNetId = useSelector(getNetworkId);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const [publicServices, setPublicServices] = useState({
    loading: true,
    services: [] as PublicServicesView[],
  });

  const updatePublicServices = () => {
    eventsService
      .listPublicServices(curNetId)
      .then(({ error, payload }) => {
        if (error) throw error;
        const state = {
          loading: false,
          services: payload.map((service) => ({
            label: service.name,
            text: stringifySocketAddress(service),
            value: {
              host: service.host,
              port: service.port,
              protocol: service.protocol,
            },
          })),
        };
        return setPublicServices(state);
      })
      .catch((err) => {
        setPublicServices({
          loading: false,
          services: [],
        });
        console.error(err); // eslint-disable-line no-console
      });
  };

  useEffect(updatePublicServices, [curNetId]);

  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  const selectItem = ({ index }) => setSelectedItemIndex(index);

  const hasPublicServices = publicServices.services.length > 0;

  const getPublicServicesDropdownData = () =>
    // eslint-disable-next-line no-nested-ternary
    publicServices.loading
      ? [{ label: 'LOADING... PLEASE WAIT', isDisabled: true }]
      : hasPublicServices
      ? publicServices.services.map(({ label, text }) => ({
          label: text ? `${label} - ${text}` : label,
        }))
      : [{ label: 'NO REMOTE API AVAILABLE', isDisabled: true }];

  const handleNext = () => {
    const netId = location?.state?.netId || curNetId;
    const value =
      publicServices.services.length > selectedItemIndex
        ? publicServices.services[selectedItemIndex].value
        : undefined;

    value &&
      dispatch(switchApiProvider(value, netId)).catch((err) => {
        console.error(err); // eslint-disable-line no-console
        dispatch(setUiError(err));
      });

    history.push(location?.state?.redirect || AuthPath.Unlock, {
      apiUrl: value,
      ...location.state,
    });
  };

  return (
    <Wrapper>
      {!!location.state?.creatingWallet && (
        <Steps step={Step.SELECT_NETWORK} isDarkMode={isDarkMode} />
      )}
      <CorneredContainer
        width={650}
        height={400}
        header="CONNECT TO SPACEMESH"
        subHeader="Select a Spacemesh API public service to connect you wallet to."
        tooltipMessage="test"
        isDarkMode={isDarkMode}
      >
        <RowColumn>
          <DropDown
            data={getPublicServicesDropdownData()}
            onClick={selectItem}
            selectedItemIndex={selectedItemIndex}
            rowHeight={40}
            isDisabled={!hasPublicServices}
          />
        </RowColumn>
        <RowColumn>
          {!publicServices.loading && (
            <Link onClick={updatePublicServices} text="REFRESH" />
          )}
        </RowColumn>

        <BackButton action={history.goBack} />
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET SETUP GUIDE" />
          {!hasPublicServices && !publicServices.loading && (
            <Button
              onClick={handleNext}
              text="SKIP"
              isPrimary={false}
              style={{ marginLeft: 'auto', marginRight: '1em' }}
            />
          )}
          <Button
            onClick={handleNext}
            text="NEXT"
            isDisabled={!hasPublicServices}
          />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default ConnectToApi;
