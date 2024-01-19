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
    CardHeader,
    Divider,
    HStack,
    Heading,
    Spinner,
    Stack,
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
            <CardHeader>
                <HStack w="full" justify={'space-between'}>
                    <Heading fontSize={20}>User Summary (AA)</Heading>
                    <HStack gap={2}>
                        <AddressButton address={address} withCopy={true} />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={transferETH}
                        >
                            SEND
                        </Button>
                    </HStack>
                </HStack>
            </CardHeader>
            <CardBody>
                <VStack w="full" spacing={4} divider={<Divider />}>
                    <Stack
                        w="full"
                        direction={['column', 'row']}
                        justifyContent={'space-between'}
                    >
                        <Text>ETH Balance</Text>
                        <HStack spacing={1}>
                            <Heading size="sm">{balance}</Heading>
                            <Text as="sub" fontSize="xs">
                                ETH
                            </Text>
                        </HStack>
                    </Stack>
                    <Stack
                        w="full"
                        direction={['column', 'row']}
                        justifyContent={'space-between'}
                    >
                        <Text>Available to Borrow</Text>
                        <HStack spacing={1}>
                            <Heading size="sm">
                                {formattedSummary.availableBorrowsUSD}
                            </Heading>
                            <Text as="sub" fontSize="xs">
                                USD
                            </Text>
                        </HStack>
                    </Stack>
                    <Stack
                        w="full"
                        direction={['column', 'row']}
                        justifyContent={'space-between'}
                    >
                        <Text>Net Worth</Text>
                        <HStack spacing={1}>
                            <Heading size="sm">
                                {formattedSummary.netWorthUSD}
                            </Heading>
                            <Text as="sub" fontSize="xs">
                                USD
                            </Text>
                        </HStack>
                    </Stack>
                    <Stack
                        w="full"
                        direction={['column', 'row']}
                        justifyContent={'space-between'}
                    >
                        <Text>Total Borrows</Text>
                        <HStack spacing={1}>
                            <Heading size="md">
                                {formattedSummary.totalBorrowsUSD}
                            </Heading>
                            <Text as="sub" fontSize="xs">
                                USD
                            </Text>
                        </HStack>
                    </Stack>

                    <Stack
                        w="full"
                        direction={['column', 'row']}
                        justifyContent={'space-between'}
                    >
                        <Text>Total Liquidity</Text>
                        <HStack spacing={1}>
                            <Heading size="md">
                                {formattedSummary.totalLiquidityUSD}
                            </Heading>
                            <Text as="sub" fontSize="xs">
                                USD
                            </Text>
                        </HStack>
                    </Stack>

                    <Stack
                        w="full"
                        direction={['column', 'row']}
                        justifyContent={'space-between'}
                    >
                        <Heading size="sm">Total Collateral</Heading>
                        <HStack spacing={1}>
                            <Heading size="lg">
                                {formattedSummary.totalCollateralUSD}
                            </Heading>
                            <Text as="sub" fontSize="md">
                                USD
                            </Text>
                        </HStack>
                    </Stack>
                </VStack>
            </CardBody>
        </Card>
    );
};
