import { useUserReservesIncentives } from '@/api';
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
    VStack,
    useMediaQuery
} from '@chakra-ui/react';
import { WithdrawAssetButton } from './WithdrawAssetButton';
import { CryptoIconMap, genericCryptoIcon } from '@/const/icons';
import { formatAPY, formatBalance } from '@/util/formatting';
import { AssetCard } from './AssetCard';

type Props = {
    address: string;
};
export const SuppliedAssets = ({ address }: Props) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const { data: userReserves } = useUserReservesIncentives(address);

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
                {isDesktop ? (
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
                                    return (
                                        <Tr key={userReserve.underlyingAsset}>
                                            <Td>
                                                <HStack spacing={2}>
                                                    <Image
                                                        src={
                                                            userReserve.reserve
                                                                ? CryptoIconMap[
                                                                      userReserve.reserve.symbol.toUpperCase()
                                                                  ]
                                                                : genericCryptoIcon
                                                        }
                                                        alt={
                                                            userReserve.reserve
                                                                ?.symbol
                                                        }
                                                        boxSize="30px"
                                                    />
                                                    <Heading size="sm">
                                                        {
                                                            userReserve.reserve
                                                                ?.name
                                                        }
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
                                                        <Text
                                                            size="sm"
                                                            as="sub"
                                                        >
                                                            {
                                                                userReserve
                                                                    .reserve
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
                                                        <Text
                                                            size="sm"
                                                            as="sub"
                                                        >
                                                            USD
                                                        </Text>
                                                    </HStack>
                                                </VStack>
                                            </Td>

                                            <Td>
                                                <Heading
                                                    size="sm"
                                                    color="green"
                                                >
                                                    {formatAPY(
                                                        userReserve.reserve
                                                            ?.supplyAPY
                                                    )}
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
                ) : (
                    availableUnderlying?.map((userReserve) => (
                        <AssetCard
                            key={userReserve.underlyingAsset}
                            asset={userReserve}
                            variant={'supplied'}
                            actionButton={
                                <WithdrawAssetButton
                                    maxAmount={userReserve.underlyingBalance}
                                    reserveAddress={
                                        userReserve.reserve.underlyingAsset
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
