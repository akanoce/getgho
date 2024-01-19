import { useBalance, useUserReservesIncentives } from '@/api';
import React from 'react';
import { AddressButton } from '.';
import { useLfghoClients } from '@repo/lfgho-sdk';
import {
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
    const { ethersProvider } = useLfghoClients();

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

    return (
        <Card>
            <CardHeader>
                <HStack w="full" justify={'space-between'}>
                    <Heading fontSize={20}>User Summary (AA)</Heading>
                    <HStack gap={2}>
                        <AddressButton address={address} withCopy={true} />
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
