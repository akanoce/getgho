import { useUserReservesIncentives } from '@/api';
import { erc20ABI, useContractReads } from 'wagmi';
import React, { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';
import { SupplyUnderlyingAssetButton } from './SupplyUnderlyingAssetButton';
import { BorrowUnderlyingAssetButton } from './BorrowUnderlyingAssetButton';
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Heading,
    Image,
    Skeleton,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useMediaQuery
} from '@chakra-ui/react';
import { CryptoIconMap, genericCryptoIcon } from '@/const/icons';
import { formatAPY, formatBalance } from '@/util/formatting';
import { AssetCard } from './AssetCard';

type Props = {
    address: string;
};

export const ReservesIncentives: React.FC<Props> = ({ address }) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    const { data: userReservesIncentives, isLoading } =
        useUserReservesIncentives(address);

    const { data: userBalances } = useContractReads({
        allowFailure: false,
        contracts:
            userReservesIncentives?.formattedUserSummary.userReservesData.map(
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
            userReservesIncentives?.formattedUserSummary.userReservesData.map(
                (userReserve, index) => ({
                    ...userReserve,
                    balance: getUserBalance(
                        index,
                        userReserve.reserve.decimals ?? 18
                    ),
                    balanceUSD:
                        Number(userReserve.reserve.priceInUSD) *
                        Number(
                            getUserBalance(
                                index,
                                userReserve.reserve.decimals ?? 18
                            )
                        )
                })
            ) ?? [],
        [userReservesIncentives, getUserBalance]
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
                    </VStack>
                    <Box textAlign={'right'}>
                        <Heading size="xs" color="green">
                            Available collateral
                        </Heading>
                        <Skeleton isLoaded={!isLoading}>
                            <Heading size="sm">
                                {formatBalance(
                                    userReservesIncentives?.formattedUserSummary
                                        ?.availableBorrowsUSD ?? 0,
                                    'USD'
                                )}
                            </Heading>
                        </Skeleton>
                    </Box>
                </HStack>
            </CardHeader>
            <CardBody>
                {isDesktop ? (
                    <TableContainer>
                        <Table variant="simple">
                            <TableCaption>
                                {reservesWithBalance.length} reserves
                            </TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Token</Th>
                                    <Th>Price</Th>
                                    <Th>Balance</Th>
                                    <Th>APY</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {reservesWithBalance.map((userReserve) => (
                                    <Tr key={userReserve.reserve.id}>
                                        <Td>
                                            <HStack spacing={2}>
                                                <Image
                                                    src={
                                                        CryptoIconMap[
                                                            userReserve.reserve.symbol.toUpperCase()
                                                        ] ?? genericCryptoIcon
                                                    }
                                                    alt={
                                                        userReserve.reserve
                                                            .symbol
                                                    }
                                                    boxSize="30px"
                                                />
                                                <Heading size="sm">
                                                    {userReserve.reserve.name}
                                                </Heading>
                                            </HStack>
                                        </Td>
                                        <Td>
                                            <Heading size="sm">
                                                {new Intl.NumberFormat(
                                                    'it-IT',
                                                    {
                                                        style: 'currency',
                                                        currency: 'USD'
                                                    }
                                                ).format(
                                                    Number(
                                                        userReserve.reserve
                                                            .priceInUSD
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
                                                <HStack spacing={1}>
                                                    <Heading size="sm">
                                                        {formatBalance(
                                                            userReserve.balance
                                                        )}
                                                    </Heading>
                                                    <Text size="sm" as="sub">
                                                        {
                                                            userReserve.reserve
                                                                .symbol
                                                        }
                                                    </Text>
                                                </HStack>
                                                <HStack spacing={1}>
                                                    <Heading size="sm">
                                                        {formatBalance(
                                                            userReserve.balanceUSD
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
                                                <Heading
                                                    size="sm"
                                                    color="green"
                                                >
                                                    S{' '}
                                                    {formatAPY(
                                                        userReserve.reserve
                                                            .supplyAPY
                                                    )}
                                                </Heading>
                                                <Heading
                                                    size="sm"
                                                    color="orange"
                                                >
                                                    B{' '}
                                                    {formatAPY(
                                                        userReserve.reserve
                                                            .variableBorrowAPY
                                                    )}
                                                </Heading>
                                            </VStack>
                                        </Td>

                                        <Td>
                                            <HStack spacing={2}>
                                                <SupplyUnderlyingAssetButton
                                                    reserveAddress={
                                                        userReserve.reserve
                                                            .underlyingAsset
                                                    }
                                                    maxAmount={
                                                        userReserve.balance
                                                    }
                                                />

                                                <BorrowUnderlyingAssetButton
                                                    userReserve={userReserve}
                                                    availableToBorrowUsd={
                                                        userReservesIncentives
                                                            ?.formattedUserSummary
                                                            .availableBorrowsUSD
                                                    }
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                ) : (
                    reservesWithBalance.map((reserveWithBalance) => (
                        <AssetCard
                            asset={reserveWithBalance}
                            key={reserveWithBalance.reserve.id}
                            variant="reserves"
                            actionButton={
                                <SupplyUnderlyingAssetButton
                                    reserveAddress={
                                        reserveWithBalance.reserve
                                            .underlyingAsset
                                    }
                                    maxAmount={reserveWithBalance.balance}
                                />
                            }
                            actionButton2={
                                <BorrowUnderlyingAssetButton
                                    userReserve={reserveWithBalance}
                                    availableToBorrowUsd={
                                        userReservesIncentives
                                            ?.formattedUserSummary
                                            .availableBorrowsUSD
                                    }
                                />
                            }
                        />
                    ))
                )}
            </CardBody>
        </Card>
    );
};
