import { useReserves, useUserReservesIncentives } from '@/api';
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Heading,
    Image,
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
import { WithdrawAssetButton } from './WithdrawAssetButton';
import { CryptoIconMap, genericCryptoIcon } from '@/const/icons';
import { formatAPY, formatBalance } from '@/util/formatting';

type Props = {
    address: string;
};
export const SuppliedAssets = ({ address }: Props) => {
    const { data: userReserves } = useUserReservesIncentives(address);
    const { data: reserves } = useReserves();

    console.log(userReserves);

    const availableUnderlying =
        userReserves?.formattedUserSummary.userReservesData.filter(
            (reserve) => reserve.underlyingBalance !== '0'
        );

    return (
        <Card>
            <CardHeader>
                <HStack w="full" justify="space-between">
                    <Heading fontSize={'2xl'}>Supplied Assets</Heading>
                    <Box textAlign={'right'}>
                        <Heading size="xs" color="green">
                            Total collateral
                        </Heading>
                        <Heading size="sm">
                            {formatBalance(
                                userReserves?.formattedUserSummary
                                    .totalCollateralUSD,
                                'USD'
                            )}
                        </Heading>
                    </Box>
                </HStack>
            </CardHeader>
            <CardBody>
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th>Underlying Balance</Th>
                                <Th>Supply APY</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {availableUnderlying?.map((userReserve) => {
                                const reserve =
                                    reserves?.formattedReserves.find(
                                        (reserve) =>
                                            reserve.id ===
                                            userReserve.reserve.id
                                    );
                                return (
                                    <Tr key={userReserve.underlyingAsset}>
                                        <Td>
                                            <HStack spacing={2}>
                                                <Image
                                                    src={
                                                        reserve
                                                            ? CryptoIconMap[
                                                                  reserve.symbol.toUpperCase()
                                                              ]
                                                            : genericCryptoIcon
                                                    }
                                                    alt={reserve?.symbol}
                                                    boxSize="30px"
                                                />
                                                <Heading size="sm">
                                                    {reserve?.name}
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
                                                            userReserve.underlyingBalance
                                                        )}
                                                    </Heading>
                                                    <Text size="sm" as="sub">
                                                        {
                                                            userReserve.reserve
                                                                .name
                                                        }
                                                    </Text>
                                                </HStack>
                                                <HStack spacing={1}>
                                                    <Heading size="sm">
                                                        {formatBalance(
                                                            userReserve.underlyingBalanceUSD
                                                        )}
                                                    </Heading>
                                                    <Text size="sm" as="sub">
                                                        USD
                                                    </Text>
                                                </HStack>
                                            </VStack>
                                        </Td>

                                        <Td>
                                            <Heading size="sm" color="green">
                                                {formatAPY(reserve?.supplyAPY)}
                                            </Heading>
                                        </Td>
                                        <Td>
                                            <WithdrawAssetButton
                                                maxAmount={
                                                    userReserve.underlyingBalance
                                                }
                                                reserveAddress={
                                                    userReserve.reserve
                                                        .underlyingAsset
                                                }
                                            />
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    );
};
