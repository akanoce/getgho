import { useReservesIncentives, useUserReservesIncentives } from '@/api';
import { erc20ABI, useContractReads } from 'wagmi';
import React from 'react';
import { formatUnits } from 'viem';
import { isNil } from 'lodash';
import { AddressButton } from '.';
import { SupplyUnderlyingAssetButton } from './SupplyUnderlyingAssetButton';
import { BorrowUnderlyingAssetButton } from './BorrowUnderlyingAssetButton';
import {
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
type Props = {
    address: string;
};
export const ReservesIncentives: React.FC<Props> = ({ address }) => {
    const { data: reservesIncentives, error: errorReservesIncentives } =
        useReservesIncentives();

    console.log({ reservesIncentives, errorReservesIncentives });

    const formattedReservesIncentives =
        reservesIncentives?.formattedReservesIncentives;

    const { data: userReservesIncentives } = useUserReservesIncentives(address);

    const formattedUserSummary = userReservesIncentives?.formattedUserSummary;

    const result = useContractReads({
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

    const getUserBalance = (assetIndex: number) => {
        return result?.data?.[assetIndex] as bigint;
    };

    const renderUnderLyingAssetBalance = (assetIndex: number) => {
        const reserveIncentive = formattedReservesIncentives?.[assetIndex];
        const balance = getUserBalance(assetIndex);

        const textBalance = isNil(balance)
            ? 'N/A'
            : formatUnits(balance, reserveIncentive?.decimals ?? 18);
        return (
            <Tag>
                <HStack spacing={1}>
                    <Text fontWeight={'semibold'}>{textBalance}</Text>
                    <Text>
                        {reserveIncentive
                            ? reserveIncentive.symbol
                            : 'Loading...'}
                    </Text>
                </HStack>
            </Tag>
        );
    };

    if (!formattedReservesIncentives)
        return (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100  flex flex-col items-center justify-center h-52 gap-y-2">
                <span className="text-2xl font-bold">Reserves Incentives</span>
                <Spinner />
            </div>
        );

    return (
        <Card>
            <CardHeader>
                <Heading fontSize={'2xl'}>Reserves Incentives</Heading>
            </CardHeader>
            <CardBody>
                <TableContainer>
                    <Table variant="simple">
                        <TableCaption>
                            {formattedReservesIncentives.length} reserves
                            incentives
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th>Address</Th>
                                <Th>Price</Th>
                                <Th>Available liquidity</Th>
                                <Th>Total debt</Th>
                                <Th>Your balance</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {formattedReservesIncentives.map(
                                (reserveIncentive, index) => (
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
                                                Number(
                                                    reserveIncentive.priceInUSD
                                                )
                                            )}
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
                                        <Td>
                                            {renderUnderLyingAssetBalance(
                                                index
                                            )}
                                        </Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <SupplyUnderlyingAssetButton
                                                    reserveAddress={
                                                        reserveIncentive.underlyingAsset
                                                    }
                                                    amount={(() => {
                                                        const balance =
                                                            getUserBalance(
                                                                index
                                                            );
                                                        if (!balance)
                                                            return '0';

                                                        const parsedBalance =
                                                            formatUnits(
                                                                balance,
                                                                reserveIncentive.decimals ??
                                                                    18
                                                            );
                                                        const smallBalance =
                                                            Number(
                                                                parsedBalance
                                                            ) * 0.1;
                                                        return smallBalance.toString();
                                                    })()}
                                                />

                                                <BorrowUnderlyingAssetButton
                                                    reserve={reserveIncentive}
                                                    formattedUserSummary={
                                                        formattedUserSummary
                                                    }
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                )
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    );
};
