import { useReservesIncentives, useUserReservesIncentives } from '@/api';
import { erc20ABI, useContractReads } from 'wagmi';
import React from 'react';
import { formatUnits } from 'viem';
import { isNil } from 'lodash';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Heading,
    Input,
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

const formatAPY = (apy: number | string) => {
    return `${(Number(apy) * 100).toFixed(2)}%`;
};

export const Funnel: React.FC<Props> = ({ address }) => {
    const { data: reservesIncentives } = useReservesIncentives();

    const formattedReservesIncentives =
        reservesIncentives?.formattedReservesIncentives;

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
            <Card>
                <CardHeader>
                    <Heading fontSize={'2xl'}>Asset to GHO converter:</Heading>
                </CardHeader>
                <CardBody>
                    <Spinner />
                </CardBody>
            </Card>
        );

    return (
        <Card>
            <CardHeader>
                <Heading fontSize={'2xl'}>Asset to GHO converter:</Heading>
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
                                <Th>Your balance</Th>
                                <Th>Supply APY</Th>
                                <Th>Borrow APY</Th>
                                <Th>Merged APY (WIP)</Th>
                                <Th>Amount</Th>
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
                                            {renderUnderLyingAssetBalance(
                                                index
                                            )}
                                        </Td>
                                        <Td>
                                            {formatAPY(
                                                formattedReservesIncentives[
                                                    index
                                                ].supplyAPY
                                            )}
                                        </Td>
                                        <Td>
                                            {formatAPY(
                                                formattedReservesIncentives[
                                                    index
                                                ].variableBorrowAPY
                                            )}
                                        </Td>
                                        <Td>
                                            {formatAPY(
                                                Number(
                                                    formattedReservesIncentives[
                                                        index
                                                    ].supplyAPY
                                                ) -
                                                    Number(
                                                        formattedReservesIncentives[
                                                            index
                                                        ].variableBorrowAPY
                                                    )
                                            )}
                                        </Td>
                                        <Td>
                                            <Input placeholder="Amount" />
                                        </Td>
                                        <Td>
                                            <Button
                                                size={'sm'}
                                                colorScheme="green"
                                                variant={'outline'}
                                                onClick={() => {}}
                                            >
                                                Convert to GHO
                                            </Button>
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
