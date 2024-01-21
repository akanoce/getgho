import { useGhoData } from '@/api';
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

export const GhoData: React.FC<Props> = ({ address }) => {
    const ghoData = useGhoData(address);
    if (!ghoData)
        return (
            <Card>
                <CardHeader>
                    <VStack spacing={0} justify={'flex-start'}>
                        <Heading fontSize={'2xl'}>Gho Dashboard</Heading>
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
                        <Heading fontSize={'2xl'}>Gho Dashboard</Heading>
                    </VStack>
                </HStack>
            </CardHeader>
            <CardBody>
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th>Price</Th>
                                <Th>Balance</Th>
                                <Th>APY</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr key={ghoData.id}>
                                <Td>
                                    <HStack spacing={2}>
                                        <Image
                                            src={
                                                CryptoIconMap[
                                                    ghoData.symbol.toUpperCase()
                                                ] ?? genericCryptoIcon
                                            }
                                            alt={ghoData.symbol}
                                            boxSize="30px"
                                        />
                                        <Heading size="sm">
                                            {ghoData.name}
                                        </Heading>
                                    </HStack>
                                </Td>

                                <Td>
                                    <Heading size="sm">
                                        {new Intl.NumberFormat('it-IT', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(Number(ghoData.price))}
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
                                                    ghoData.borrowedBalance
                                                )}
                                            </Heading>
                                            <Text size="sm" as="sub">
                                                {ghoData.symbol}
                                            </Text>
                                        </HStack>
                                        <HStack spacing={1}>
                                            <Heading size="sm">
                                                {formatBalance(
                                                    ghoData.borrowedBalanceUSD
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
                                        <Heading size="sm" color="orange">
                                            {formatAPY(ghoData.borrowAPY)}
                                        </Heading>
                                    </VStack>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    );
};
