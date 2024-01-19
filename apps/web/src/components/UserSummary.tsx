import { useBalance, useUserReservesIncentives } from '@/api';
import React from 'react';
import { AddressButton } from '.';
import { useLfghoClients, sendTransactionWithSponsor } from '@repo/lfgho-sdk';
import { Address } from 'viem';
import { erc20ABI } from 'wagmi';
import { Interface } from 'ethers/lib/utils';
import {
    Button,
    Card,
    CardBody,
    HStack,
    Heading,
    Spinner,
    Text,
    VStack
} from '@chakra-ui/react';

type Props = {
    address: string;
};
export const UserSummary: React.FC<Props> = ({ address }) => {
    const {
        ethersProvider,
        pimlicoBundler,
        pimlicoPaymaster,
        viemPublicClient,
        getViemInstance
    } = useLfghoClients();

    const { data: balance } = useBalance(ethersProvider, address);
    const { data: userReservesIncentives } = useUserReservesIncentives(address);

    const formattedSummary = userReservesIncentives?.formattedUserSummary;

    if (!formattedSummary)
        return (
            <Card>
                <CardBody>
                    <span>User Summary</span>
                    <Spinner />
                </CardBody>
            </Card>
        );

    const transferETH = async () => {
        const iface = new Interface(erc20ABI);

        const passkeyAccount = (await getViemInstance()).account;

        const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];

        await sendTransactionWithSponsor(
            '0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0', //USDT
            iface,
            'transfer',
            ['0x3427034D30c9306F95715C6b14690587584cCEDF', 1000000n],
            0n,
            address as Address,
            pimlicoBundler,
            pimlicoPaymaster,
            viemPublicClient,
            passkeyAccount,
            entryPoint
        );
    };

    return (
        <Card>
            <CardBody>
                <HStack>
                    <Heading fontSize={20}>User Summary (AA)</Heading>
                    <AddressButton address={address} withCopy={true} />
                    <Button onClick={transferETH}>SEND</Button>
                </HStack>
                <VStack w="full">
                    <HStack w="full" justifyContent={'space-between'}>
                        <Text>ETH Balance</Text>
                        <Heading size="sm">{balance} ETH</Heading>
                    </HStack>
                    <HStack w="full" justifyContent={'space-between'}>
                        <Text>Available to Borrow</Text>
                        <Heading size="sm">
                            {formattedSummary.availableBorrowsUSD} USD
                        </Heading>
                    </HStack>
                    <HStack w="full" justifyContent={'space-between'}>
                        <Text>Net Worth</Text>
                        <Heading size="sm">
                            {formattedSummary.netWorthUSD} USD
                        </Heading>
                    </HStack>
                    <HStack w="full" justifyContent={'space-between'}>
                        <Text>Total Borrows</Text>
                        <Heading size="sm">
                            {formattedSummary.totalBorrowsUSD} USD
                        </Heading>
                    </HStack>

                    <HStack w="full" justifyContent={'space-between'}>
                        <Text>Total Liquidity</Text>
                        <Heading size="sm">
                            {formattedSummary.totalLiquidityUSD} USD
                        </Heading>
                    </HStack>

                    <HStack w="full" justifyContent={'space-between'}>
                        <Text>Total Collateral</Text>
                        <Heading>
                            {formattedSummary.totalCollateralUSD} USD
                        </Heading>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
};
