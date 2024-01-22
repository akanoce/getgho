import {
    Box,
    Card,
    Checkbox,
    Fade,
    HStack,
    Heading,
    Image,
    Text
} from '@chakra-ui/react';
import { MergedAsset } from '../api';
import { CryptoIconMap } from '../const/icons';
import { formatAPY, formatBalance } from '../util/formatting';

type Props = {
    asset: MergedAsset;
    isSelected: boolean;
    toggleSelected: () => void;
};
export const AssetToSupplySimpleClickableCard = ({
    asset,
    isSelected,
    toggleSelected
}: Props) => {
    return (
        <Fade in={true} style={{ width: '100%' }}>
            <Card
                w="full"
                p={4}
                rounded="md"
                shadow="md"
                cursor="pointer"
                _hover={{ shadow: 'lg' }}
                onClick={toggleSelected}
            >
                <HStack justify={'space-between'} align={'center'}>
                    <HStack spacing={4}>
                        <Checkbox colorScheme="purple" isChecked={isSelected} />
                        <Box>
                            <Image
                                src={CryptoIconMap[asset.symbol]}
                                boxSize="40px"
                            />
                        </Box>
                        <Box>
                            <Heading size="sm">{asset.symbol}</Heading>
                            <Text
                                fontSize="sm"
                                fontWeight={'semibold'}
                                color={'green'}
                            >
                                {formatAPY(asset.supplyAPY)}
                            </Text>
                        </Box>
                    </HStack>
                    <Box>
                        <HStack spacing={1}>
                            <Heading size="xs">
                                {formatBalance(asset.availableBalance)}
                            </Heading>
                            <Text fontSize={'xs'}>{asset.symbol}</Text>
                        </HStack>
                        <HStack spacing={1}>
                            <Heading size="xs">
                                {formatBalance(asset.availableBalanceUSD)}
                            </Heading>
                            <Text fontSize={'xs'}>{'USD'}</Text>
                        </HStack>
                    </Box>
                </HStack>
            </Card>
        </Fade>
    );
};
