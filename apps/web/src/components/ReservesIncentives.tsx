import { useReservesIncentives, useUserReservesIncentives } from '@/api';
import { erc20ABI, useContractReads } from 'wagmi';
import React, { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';
import { AddressButton } from '.';
import { SupplyUnderlyingAssetButton } from './SupplyUnderlyingAssetButton';
import { BorrowUnderlyingAssetButton } from './BorrowUnderlyingAssetButton';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Heading,
    Spinner,
    Table,
    TableCaption,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import { useMultipleSupplyWithBorrow } from '@/hooks/useMultipleSupplyWithBorrow';
type Props = {
    address: string;
};
export const ReservesIncentives: React.FC<Props> = ({ address }) => {
    const { data: reservesIncentives, error: errorReservesIncentives } =
        useReservesIncentives();

    const formattedReservesIncentives =
        reservesIncentives?.formattedReservesIncentives;

    const { data: userReservesIncentives } = useUserReservesIncentives(address);

    const formattedUserSummary = userReservesIncentives?.formattedUserSummary;

    const { data: userBalances, isLoading: isUserBalancesLoading } =
        useContractReads({
            allowFailure: false,
            contracts: reservesIncentives?.formattedReservesIncentives.map(
                (reserveIncentive) => ({
                    address: reserveIncentive.underlyingAsset as `0x${string}`,
                    abi: erc20ABI,
                    functionName: 'balanceOf',
                    args: [address]
                })
            )
        });
    const getUserBalance = useCallback(
        (assetIndex: number, decimals: number) => {
            const balance = userBalances?.[assetIndex] as bigint;
            if (!balance) return '0';

            const parsedBalance = formatUnits(balance, decimals);

            return parsedBalance;
        },
        [userBalances]
    );

    const reservesWithBalance = useMemo(
        () =>
            reservesIncentives?.formattedReservesIncentives.map(
                (reserve, index) => ({
                    ...reserve,
                    balance: getUserBalance(index, reserve.decimals ?? 18),
                    underlyingBalanceUSD:
                        Number(reserve.priceInUSD) *
                        Number(getUserBalance(index, reserve.decimals ?? 18))
                })
            ) ?? [],
        [reservesIncentives, getUserBalance]
    );

    const ghoReserve = reservesIncentives?.formattedReservesIncentives.find(
        (reserve) => reserve.symbol === 'GHO'
    );

    const availableReservesWithBalance = useMemo(
        () =>
            reservesWithBalance
                ?.filter((reserve) => reserve.balance !== '0')
                .map((reserve) => ({
                    reserve,
                    amount: reserve.balance,
                    amountInUsd: reserve.underlyingBalanceUSD
                })) ?? [],
        [reservesWithBalance]
    );

    const availableSuppliableReservesWithBalance = useMemo(
        () =>
            availableReservesWithBalance.filter(
                (reserve) => reserve.reserve.supplyCap !== '0'
            ),
        [availableReservesWithBalance]
    );

    const { mutate: multipleSupplyAndBorrow, isSupplyTxLoading } =
        useMultipleSupplyWithBorrow({
            toBorrow: ghoReserve,
            toSupply: availableSuppliableReservesWithBalance
        });

    if (!formattedReservesIncentives)
        return (
            <Card>
                <CardHeader>
                    <Heading fontSize={'2xl'}>Reserves Incentives</Heading>
                </CardHeader>
                <CardBody>
                    <Spinner />
                </CardBody>
            </Card>
        );

    return (
        <Card>
            <CardHeader>
                <HStack justify={'space-between'} alignItems={'center'}>
                    <Heading fontSize={'2xl'}>Reserves Incentives</Heading>
                    <Button
                        size={'sm'}
                        colorScheme={'purple'}
                        isLoading={isSupplyTxLoading}
                        onClick={() => multipleSupplyAndBorrow()}
                    >
                        Supply all & Borrow
                    </Button>
                </HStack>
            </CardHeader>
            <CardBody>
                <TableContainer>
                    <Table variant="simple">
                        <TableCaption>
                            {reservesWithBalance.length} reserves incentives
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th>Address</Th>
                                <Th>Price</Th>
                                <Th>Balance</Th>
                                <Th>Balance USDT</Th>
                                <Th>Available liquidity</Th>
                                <Th>Total debt</Th>
                                <Th>SupplyCaP</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {reservesWithBalance.map((reserveIncentive) => (
                                <Tr key={reserveIncentive.id}>
                                    <Td>
                                        <Tag colorScheme="blue">
                                            {reserveIncentive.name}
                                        </Tag>
                                    </Td>
                                    <Td>
                                        <AddressButton
                                            address={
                                                reserveIncentive.underlyingAsset
                                            }
                                            withCopy={true}
                                        />
                                    </Td>
                                    <Td>
                                        {new Intl.NumberFormat('it-IT', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(
                                            Number(reserveIncentive.priceInUSD)
                                        )}
                                    </Td>
                                    <Td>
                                        <Tag>
                                            <HStack spacing={1}>
                                                <Text fontWeight={'semibold'}>
                                                    {reserveIncentive.balance}
                                                </Text>
                                                <Text>
                                                    {reserveIncentive.symbol}
                                                </Text>
                                            </HStack>
                                        </Tag>
                                    </Td>
                                    <Td>
                                        <Tag>
                                            <HStack spacing={1}>
                                                <Text fontWeight={'semibold'}>
                                                    {
                                                        reserveIncentive.underlyingBalanceUSD
                                                    }
                                                </Text>
                                                <Text>USD</Text>
                                            </HStack>
                                        </Tag>
                                    </Td>
                                    <Td>
                                        {new Intl.NumberFormat('it-IT', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(
                                            Number(
                                                reserveIncentive.availableLiquidityUSD
                                            )
                                        )}
                                    </Td>
                                    <Td>
                                        {new Intl.NumberFormat('it-IT', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(
                                            Number(
                                                reserveIncentive.totalDebtUSD
                                            )
                                        )}
                                    </Td>

                                    <Td>{reserveIncentive.supplyCapUSD}</Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <SupplyUnderlyingAssetButton
                                                reserveAddress={
                                                    reserveIncentive.underlyingAsset
                                                }
                                                amount={(() => {
                                                    const smallBalance =
                                                        Number(
                                                            reserveIncentive.balance
                                                        ) * 0.1;
                                                    return smallBalance.toString();
                                                })()}
                                            />

                                            <BorrowUnderlyingAssetButton
                                                reserve={reserveIncentive}
                                                formattedUserSummary={
                                                    formattedUserSummary
                                                }
                                                user={address}
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    );
};
