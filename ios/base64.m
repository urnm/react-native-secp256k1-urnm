#include "base64.h"

#define ArrayLength(x) (sizeof(x)/sizeof(*(x)))

static char encodingTable[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

static char decodingTable[128];

+ (void) initialize {
  if (self == [Base64 class]) {
    memset(decodingTable, 0, ArrayLength(decodingTable));
    for (NSInteger i = 0; i < ArrayLength(encodingTable); i++) {
      decodingTable[encodingTable[i]] = i;
    }
  }
}

+ (NSString*) encode:(const uint8_t*) input length:(NSInteger) length {
    NSMutableData* data = [NSMutableData dataWithLength:((length + 2) / 3) * 4];
    uint8_t* output = (uint8_t*)data.mutableBytes;
    for (NSInteger i = 0; i < length; i += 3) {
        NSInteger value = 0;
        for (NSInteger j = i; j < (i + 3); j++) {
            value <<= 8;
            if (j < length) {
                value |= (0xFF & input[j]);
            }
        }
        NSInteger index = (i / 3) * 4;
        output[index + 0] =                    encodingTable[(value >> 18) & 0x3F];
        output[index + 1] =                    encodingTable[(value >> 12) & 0x3F];
        output[index + 2] = (i + 1) < length ? encodingTable[(value >> 6)  & 0x3F] : '=';
        output[index + 3] = (i + 2) < length ? encodingTable[(value >> 0)  & 0x3F] : '=';
    }

    return [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
}



+ (NSString*) encode:(NSData*) rawBytes {
    return [self encode:(const uint8_t*) rawBytes.bytes length:rawBytes.length];
}



+ (NSData*) decode:(const char*) string length:(NSInteger) inputLength {
  if ((string == NULL) || (inputLength % 4 != 0)) {
    return nil;
  }
  while (inputLength > 0 && string[inputLength - 1] == '=') {
    inputLength--;
  }
  NSInteger outputLength = inputLength * 3 / 4;
  NSMutableData* data = [NSMutableData dataWithLength:outputLength];
  uint8_t* output = data.mutableBytes;
  NSInteger inputPoint = 0;
  NSInteger outputPoint = 0;
  while (inputPoint < inputLength) {
    char i0 = string[inputPoint++];
    char i1 = string[inputPoint++];
    char i2 = inputPoint < inputLength ? string[inputPoint++] : 'A'; /* 'A' will decode to \0 */
    char i3 = inputPoint < inputLength ? string[inputPoint++] : 'A';
    output[outputPoint++] = (decodingTable[i0] << 2) | (decodingTable[i1] >> 4);

    if (outputPoint < outputLength) {
      output[outputPoint++] = ((decodingTable[i1] & 0xf) << 4) | (decodingTable[i2] >> 2);
    }

    if (outputPoint < outputLength) {
      output[outputPoint++] = ((decodingTable[i2] & 0x3) << 6) | decodingTable[i3];
    }
  }
  return data;
}

+ (NSData*) decode:(NSString*) string {
  return [self decode:[string cStringUsingEncoding:NSASCIIStringEncoding] length:string.length];
}



static const char BASE64_STANDARD_ENCODE[65] =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
static const unsigned char BASE64_STANDARD_DECODE[256] = {
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x3E,
    0xFF, 0xFF, 0xFF, 0x3F,  // +/
    0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0xFF,
    0xFF, 0xFF, 0x00, 0xFF, 0xFF,  // 0-9 =
    0xFF, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
    0x0A, 0x0B, 0x0C, 0x0D, 0x0E,  // A-O
    0x0F, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF,  // P-Z
    0xFF, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20, 0x21, 0x22, 0x23,
    0x24, 0x25, 0x26, 0x27, 0x28,  // a-o
    0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x30, 0x31, 0x32, 0x33,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF,  // p-z
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
};

size_t to_base64_len(size_t buf_size) {
    size_t r = (buf_size / 3) * 4;
    switch (buf_size % 3) {
        case 1:
            r += 2;
            break;
        case 2:
            r += 3;
            break;
        default:
            break;
    }
    return r;
}
void to_base64(const void *buf, size_t buf_size, char *out) {
    size_t tail_len = buf_size % 3;
    size_t loop_size = buf_size - tail_len;
    const uint8_t *input = (const uint8_t *)buf;
    const char *encode_str = BASE64_STANDARD_ENCODE;

    for (size_t i = 0; i < loop_size; i += 3) {
        // 11111111 11111111 11111111
        // 11111122 22223333 33444444
        uint8_t byte1 = input[0] >> 2;
        uint8_t byte2 = ((input[0] & 0x3) << 4) | (input[1] >> 4);
        uint8_t byte3 = ((input[1] & 0xF) << 2) | (input[2] >> 6);
        uint8_t byte4 = input[2] & 0x3F;
        out[0] = encode_str[byte1];
        out[1] = encode_str[byte2];
        out[2] = encode_str[byte3];
        out[3] = encode_str[byte4];
        out += 4;
        input += 3;
    }

    if (tail_len) {
        uint8_t byte1 = input[0] >> 2;
        uint8_t byte2 = ((input[0] & 0x3) << 4);
        out[0] = encode_str[byte1];
        if (tail_len == 2) {
            byte2 |= (input[1] >> 4);
            uint8_t byte3 = (input[1] & 0xF) << 2;
            out[1] = encode_str[byte2];
            out[2] = encode_str[byte3];
        } else {
            out[1] = encode_str[byte2];
        }
    }
}
size_t from_base64_max_len(size_t str_len) {
    return ((str_len + 3) / 4) * 3;
}
size_t from_base64(const char *str, size_t str_len, void *buf) {
    uint8_t byte1, byte2, byte3, byte4;
    size_t tail_len = str_len % 4;
    size_t loop_size = str_len - tail_len;
    const uint8_t *input = (const uint8_t *)str;
    uint8_t *output = (uint8_t *)buf;
    const unsigned char *decode_str = BASE64_STANDARD_DECODE;

    for (size_t i = 0; i < loop_size; i += 4) {
        // 11111111 11111111 11111111
        // 11111122 22223333 33444444
        byte1 = decode_str[input[0]];
        byte2 = decode_str[input[1]];
        byte3 = decode_str[input[2]];
        byte4 = decode_str[input[3]];

        if (byte1 == 0xFF || byte2 == 0xFF || byte3 == 0xFF || byte4 == 0xFF)
            return output - (uint8_t *)buf;

        output[0] = (byte1 << 2) | (byte2 >> 4);
        output[1] = (byte2 << 4) | (byte3 >> 2);
        output[2] = (byte3 << 6) | byte4;

        output += 3;
        input += 4;
    }

    // 剩余1个字节是不合法的，编码的时候最后一个字节会编成2个字节
    switch (tail_len) {
        case 2:
            byte1 = decode_str[input[0]];
            byte2 = decode_str[input[1]];
            if (byte1 == 0xFF || byte2 == 0xFF) break;
            *output++ = (byte1 << 2) | ((byte2 >> 4) & 0x3);
            break;
        case 3:
            byte1 = decode_str[input[0]];
            byte2 = decode_str[input[1]];
            byte3 = decode_str[input[2]];
            if (byte1 == 0xFF || byte2 == 0xFF || byte3 == 0xFF) break;
            output[0] = (byte1 << 2) | ((byte2 >> 4) & 0x3);
            output[1] = (byte2 << 4) | ((byte3 >> 2) & 0xF);
            output += 2;
            break;
        default:
            break;
    }

    return output - (uint8_t *)buf;
}
