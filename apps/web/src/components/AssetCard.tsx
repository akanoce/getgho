import {
    Box,
    Card,
    Fade,
    HStack,
    Heading,
    Image,
    Text,
    VStack
} from '@chakra-ui/react';
import { CryptoIconMap } from '../const/icons';
import { formatAPY, formatBalance } from '../util/formatting';
import { ReserveDataHumanized } from '@aave/aave-utilities';
import {
    FormatReserveUSDResponse,
    ComputedUserReserve
} from '@aave/aave-utilities/packages/math-utils';

type UserSummaryWithReserve = ComputedUserReserve<
    ReserveDataHumanized & FormatReserveUSDResponse
>;
type Props =
    | {
          asset: UserSummaryWithReserve;
          variant: 'supplied' | 'borrowed';
          actionButton?: React.ReactNode;
          actionButton2?: React.ReactNode;
      }
    | {
          asset: UserSummaryWithReserve & {
              balance: string | number;
              balanceUSD: string | number;
          };
          variant: 'reserves';
          actionButton?: React.ReactNode;
          actionButton2?: React.ReactNode;
      };

export const AssetCard = (props: Props) => {
    return (
        <Fade in={true} style={{ width: '100%' }}>
            <Card w="full" p={4} rounded="md" shadow="md">
                <AssetCardContent {...props} />
            </Card>
        </Fade>
    );
};

export const AssetCardContent = ({
    asset,
    variant,
    actionButton,
    ...others
}: Props) => {
    if (variant === 'supplied')
        return (
            <HStack justify={'space-between'} align={'center'}>
                <HStack spacing={4}>
                    <Box>
                        <Image
                            src={CryptoIconMap[asset.reserve.symbol]}
                            boxSize="40px"
                        />
                    </Box>
                    <Box>
                        <Heading size="sm">{asset.reserve.symbol}</Heading>
                        <Text
                            fontSize="sm"
                            fontWeight={'semibold'}
                            color={'green'}
                        >
                            {formatAPY(asset.reserve.supplyAPY)}
                        </Text>
                    </Box>
                </HStack>
                <Box>
                    <Text fontSize={'xs'}>{'Supplied'}</Text>
                    <HStack spacing={1}>
                        <Heading size="xs">
                            {formatBalance(asset.underlyingBalance)}
                        </Heading>
                        <Text fontSize={'xs'}>{asset.reserve.symbol}</Text>
                    </HStack>
                    <HStack spacing={1}>
                        <Heading size="xs">
                            {formatBalance(asset.underlyingBalanceUSD)}
                        </Heading>
                        <Text fontSize={'xs'}>{'USD'}</Text>
                    </HStack>
                </Box>
                {actionButton}
            </HStack>
        );
    if (variant === 'borrowed')
        return (
            <HStack justify={'space-between'} align={'center'}>
                <HStack spacing={4}>
                    <Box>
                        <Image
                            src={CryptoIconMap[asset.reserve.symbol]}
                            boxSize="40px"
                        />
                    </Box>
                    <Box>
                        <Heading size="sm">{asset.reserve.symbol}</Heading>
                        <Text
                            fontSize="sm"
                            fontWeight={'semibold'}
                            color={'orange'}
                        >
                            {formatAPY(asset.reserve.variableBorrowAPY)}
                        </Text>
                    </Box>
                </HStack>
                <Box>
                    <Text fontSize={'xs'}>{'Borrowed'}</Text>
                    <HStack spacing={1}>
                        <Heading size="xs">
                            {formatBalance(asset.totalBorrows)}
                        </Heading>
                        <Text fontSize={'xs'}>{asset.reserve.symbol}</Text>
                    </HStack>
                    <HStack spacing={1}>
                        <Heading size="xs">
                            {formatBalance(asset.totalBorrowsUSD)}
                        </Heading>
                        <Text fontSize={'xs'}>{'USD'}</Text>
                    </HStack>
                </Box>
                {actionButton}
            </HStack>
        );
    if (variant === 'reserves')
        return (
            <VStack w="full">
                <HStack justify={'space-between'} align={'center'} w="full">
                    <HStack spacing={4}>
                        <Box>
                            <Image
                                src={CryptoIconMap[asset.reserve.symbol]}
                                boxSize="40px"
                            />
                        </Box>
                        <Box>
                            <Heading size="sm">{asset.reserve.symbol}</Heading>
                            <Text fontSize="sm" fontWeight={'semibold'}>
                                {formatBalance(asset.reserve.priceInUSD, 'USD')}
                            </Text>
                        </Box>
                    </HStack>
                    <Box>
                        <Text fontSize={'xs'}>{'Balance'}</Text>
                        <HStack spacing={1}>
                            <Heading size="xs">
                                {formatBalance(asset.balance)}
                            </Heading>
                            <Text fontSize={'xs'}>{asset.reserve.symbol}</Text>
                        </HStack>
                        <HStack spacing={1}>
                            <Heading size="xs">
                                {formatBalance(asset.balanceUSD)}
                            </Heading>
                            <Text fontSize={'xs'}>{'USD'}</Text>
                        </HStack>
                    </Box>
                </HStack>
                <HStack w="full" justify={'space-between'}>
                    <Box>
                        <Text fontSize="sm">{'Supplied'}</Text>
                        <Heading size="xs" color="green">
                            {formatAPY(asset.reserve.supplyAPY)}
                        </Heading>
                    </Box>
                    <Box>
                        <HStack spacing={1}>
                            <Heading size="xs">
                                {formatBalance(asset.underlyingBalance)}
                            </Heading>
                            <Text fontSize={'xs'}>{asset.reserve.symbol}</Text>
                        </HStack>
                        <HStack spacing={1}>
                            <Heading size="xs">
                                {formatBalance(asset.underlyingBalanceUSD)}
                            </Heading>
                            <Text fontSize={'xs'}>{'USD'}</Text>
                        </HStack>
                    </Box>
                    {actionButton}
                </HStack>
                <HStack w="full" justify={'space-between'}>
                    <Box>
                        <Text fontSize="sm">{'Borrow'}</Text>
                        <Heading size="xs" color="orange">
                            {formatAPY(asset.reserve.variableBorrowAPY)}
                        </Heading>
                    </Box>
                    <Box>
                        <HStack spacing={1}>
                            <Heading size="xs">
                                {formatBalance(asset.totalBorrows)}
                            </Heading>
                            <Text fontSize={'xs'}>{asset.reserve.symbol}</Text>
                        </HStack>
                        <HStack spacing={1}>
                            <Heading size="xs">
                                {formatBalance(asset.totalBorrowsUSD)}
                            </Heading>
                            <Text fontSize={'xs'}>{'USD'}</Text>
                        </HStack>
                    </Box>
                    {others.actionButton2}
                </HStack>
            </VStack>
        );

    return <></>;
};
