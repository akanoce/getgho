import { useMergedTableData } from '@/api';
import React from 'react';
import {
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
import { CryptoIconMap, genericCryptoIcon } from '@/const/icons';
import { formatAPY, formatBalance } from '@/util/formatting';

type Props = {
    address: string;
};

export const MergedTable: React.FC<Props> = ({ address }) => {
    const mergedData = useMergedTableData({ address, showAll: false });

    console.log({
        mergedData
    });

    if (!mergedData)
        return (
            <Card>
                <CardHeader>
                    <VStack spacing={0} justify={'flex-start'}>
                        <Heading fontSize={'2xl'}>MERGED</Heading>
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
                        <Heading fontSize={'2xl'}>MERGED</Heading>
                    </VStack>
                </HStack>
            </CardHeader>
            <CardBody>
                <TableContainer>
                    <Table variant="simple">
                        <TableCaption>
                            {mergedData.length} reserves incentives
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th>Available</Th>
                                <Th>Supplied</Th>
                                <Th>Borrowed</Th>
                                <Th>Price</Th>
                                <Th>APY</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {mergedData.map((asset) => (
                                <Tr key={asset.id}>
                                    <Td>
                                        <HStack spacing={2}>
                                            <Image
                                                src={
                                                    CryptoIconMap[
                                                        asset.symbol.toUpperCase()
                                                    ] ?? genericCryptoIcon
                                                }
                                                alt={asset.symbol}
                                                boxSize="30px"
                                            />
                                            <Heading size="sm">
                                                {asset.name}
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
                                                        asset.availableBalance
                                                    )}
                                                </Heading>
                                                <Text size="sm" as="sub">
                                                    {asset.symbol}
                                                </Text>
                                            </HStack>
                                            <HStack spacing={1}>
                                                <Heading size="sm">
                                                    {formatBalance(
                                                        asset.availableBalanceUSD
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
                                                        asset.suppliedBalance
                                                    )}
                                                </Heading>
                                                <Text size="sm" as="sub">
                                                    {asset.symbol}
                                                </Text>
                                            </HStack>
                                            <HStack spacing={1}>
                                                <Heading size="sm">
                                                    {formatBalance(
                                                        asset.suppliedBalanceUSD
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
                                                        asset.borrowedBalance
                                                    )}
                                                </Heading>
                                                <Text size="sm" as="sub">
                                                    {asset.symbol}
                                                </Text>
                                            </HStack>
                                            <HStack spacing={1}>
                                                <Heading size="sm">
                                                    {formatBalance(
                                                        asset.borrowedBalanceUSD
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
                                            }).format(Number(asset.price))}
                                        </Heading>
                                    </Td>

                                    <Td>
                                        <VStack
                                            spacing={0}
                                            justify={'flex-start'}
                                            align={'flex-start'}
                                        >
                                            <Heading size="sm" color="green">
                                                S {formatAPY(asset.supplyAPY)}
                                            </Heading>
                                            <Heading size="sm" color="orange">
                                                B {formatAPY(asset.borrowAPY)}
                                            </Heading>
                                        </VStack>
                                    </Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            {/* <SupplyUnderlyingAssetButton
                                                reserveAddress={
                                                    asset.underlyingAsset
                                                }
                                                maxAmount={asset.balance}
                                            /> */}

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
