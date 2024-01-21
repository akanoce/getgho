import { useReservesIncentives, useUserReservesIncentives } from '@/api';
import { erc20ABI, useContractReads } from 'wagmi';
import React, { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';
import { SupplyUnderlyingAssetButton } from './SupplyUnderlyingAssetButton';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Heading,
    Image,
    Spinner,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react';
import { useMultipleSupplyWithBorrow } from '@/hooks/useMultipleSupplyWithBorrow';
import { CryptoIconMap, genericCryptoIcon } from '@/const/icons';
import { formatAPY, formatBalance } from '@/util/formatting';

type Props = {
    address: string;
};

export const ReservesIncentives: React.FC<Props> = ({ address }) => {
    const { data: reservesIncentives } = useReservesIncentives();

    const formattedReservesIncentives =
        reservesIncentives?.formattedReservesIncentives;

    const { data: userReservesIncentives } = useUserReservesIncentives(address);

    const formattedUserSummary = userReservesIncentives?.formattedUserSummary;

    const { data: userBalances } = useContractReads({
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
            reservesIncentives?.formattedReservesIncentives
                .map((reserve, index) => ({
                    ...reserve,
                    balance: getUserBalance(index, reserve.decimals ?? 18),
                    underlyingBalanceUSD:
                        Number(reserve.priceInUSD) *
                        Number(getUserBalance(index, reserve.decimals ?? 18))
                }))
                .filter((reserve) => reserve.balance !== '0') ?? [],
        [reservesIncentives, getUserBalance]
    );

    const ghoReserve = reservesIncentives?.formattedReservesIncentives.find(
        (reserve) => reserve.symbol === 'GHO'
    );

    const availableReservesWithBalance = useMemo(
        () =>
            reservesWithBalance.map((reserve) => ({
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
                    <VStack spacing={0} justify={'flex-start'}>
                        <Heading fontSize={'2xl'}>Reserves Incentives</Heading>
                        <HStack spacing={2}>
                            <Heading size="sm">Available to borrow</Heading>
                            <Heading size="sm">
                                {formatBalance(
                                    formattedUserSummary?.availableBorrowsUSD ??
                                        0
                                )}
                            </Heading>
                        </HStack>
                    </VStack>
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
                    <VStack
                        spacing={0}
                        justify={'flex-start'}
                        align={'flex-start'}
                    >
                        <Heading fontSize={'2xl'}>Reserves Incentives</Heading>
                        <HStack spacing={2}>
                            <Heading size="sm" color="orange">
                                Available to borrow
                            </Heading>
                            <Heading size="sm">
                                {formatBalance(
                                    formattedUserSummary?.availableBorrowsUSD ??
                                        0,
                                    'USD'
                                )}
                            </Heading>
                        </HStack>
                    </VStack>
                    <Button
                        size={'sm'}
                        colorScheme={'purple'}
                        isLoading={isSupplyTxLoading}
                        onClick={() => multipleSupplyAndBorrow()}
                    >
                        Supply all & Borrow Gho
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
                                <Th>Balance</Th>
                                <Th>Price</Th>
                                <Th>APY</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {reservesWithBalance.map((reserveIncentive) => (
                                <Tr key={reserveIncentive.id}>
                                    <Td>
                                        <HStack spacing={2}>
                                            <Image
                                                src={
                                                    CryptoIconMap[
                                                        reserveIncentive.symbol.toUpperCase()
                                                    ] ?? genericCryptoIcon
                                                }
                                                alt={reserveIncentive.symbol}
                                                boxSize="30px"
                                            />
                                            <Heading size="sm">
                                                {reserveIncentive.name}
                                            </Heading>
                                        </HStack>
                                    </Td>
                                    <Td>
                                        <VStack
                                            spacing={0}
                                            justify={'flex-start'}
                                            align={'flex-start'}
                                        >
                                            <HStack spacing={1}>
                                                <Heading size="sm">
                                                    {formatBalance(
                                                        reserveIncentive.balance
                                                    )}
                                                </Heading>
                                                <Text size="sm" as="sub">
                                                    {reserveIncentive.symbol}
                                                </Text>
                                            </HStack>
                                            <HStack spacing={1}>
                                                <Heading size="sm">
                                                    {formatBalance(
                                                        reserveIncentive.underlyingBalanceUSD
                                                    )}
                                                </Heading>
                                                <Text size="sm" as="sub">
                                                    USD
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Td>
                                    <Td>
                                        <Heading size="sm">
                                            {new Intl.NumberFormat('it-IT', {
                                                style: 'currency',
                                                currency: 'USD'
                                            }).format(
                                                Number(
                                                    reserveIncentive.priceInUSD
                                                )
                                            )}
                                        </Heading>
                                    </Td>

                                    <Td>
                                        <VStack
                                            spacing={0}
                                            justify={'flex-start'}
                                            align={'flex-start'}
                                        >
                                            <Heading size="sm" color="green">
                                                {formatAPY(
                                                    reserveIncentive.supplyAPY
                                                )}
                                            </Heading>
                                            <Heading size="sm" color="orange">
                                                {formatAPY(
                                                    reserveIncentive.variableBorrowAPY
                                                )}
                                            </Heading>
                                        </VStack>
                                    </Td>
                                    {/*<Td>
                                        <VStack
                                            spacing={0}
                                            justify={'flex-start'}
                                            align={'flex-start'}
                                        >
                                            <Heading size="sm" color="green">
                                                {reserveIncentive.supplyCap}
                                            </Heading>
                                            <Heading size="sm" color="orange">
                                                {reserveIncentive.borrowCap}
                                            </Heading>
                                        </VStack>
                                    </Td>

                                    <Td>
                                        <VStack
                                            spacing={0}
                                            justify={'flex-start'}
                                            align={'flex-start'}
                                        >
                                            <HStack spacing={1}>
                                                <Heading size="sm">
                                                    {formatBalance(
                                                        reserveIncentive.availableLiquidity
                                                    )}
                                                </Heading>
                                                <Text size="sm" as="sub">
                                                    {reserveIncentive.symbol}
                                                </Text>
                                            </HStack>
                                            <HStack spacing={1}>
                                                <Heading size="sm">
                                                    {formatBalance(
                                                        reserveIncentive.availableLiquidityUSD
                                                    )}
                                                </Heading>
                                                <Text size="sm" as="sub">
                                                    USD
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Td>
                                    <Td>
                                        <VStack
                                            spacing={0}
                                            justify={'flex-start'}
                                            align={'flex-start'}
                                        >
                                            <HStack spacing={1}>
                                                <Heading size="sm">
                                                    {formatBalance(
                                                        reserveIncentive.totalDebt
                                                    )}
                                                </Heading>
                                                <Text size="sm" as="sub">
                                                    {reserveIncentive.symbol}
                                                </Text>
                                            </HStack>
                                            <HStack spacing={1}>
                                                <Heading size="sm">
                                                    {formatBalance(
                                                        reserveIncentive.totalDebtUSD
                                                    )}
                                                </Heading>
                                                <Text size="sm" as="sub">
                                                    USD
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Td>
 */}
                                    <Td>
                                        <HStack spacing={2}>
                                            <SupplyUnderlyingAssetButton
                                                reserveAddress={
                                                    reserveIncentive.underlyingAsset
                                                }
                                                maxAmount={
                                                    reserveIncentive.balance
                                                }
                                            />

                                            {/* <BorrowUnderlyingAssetButton
                                                reserve={reserveIncentive}
                                                formattedUserSummary={
                                                    formattedUserSummary
                                                }
                                            /> */}
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
