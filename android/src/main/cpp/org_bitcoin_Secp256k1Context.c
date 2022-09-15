#include <jni.h>
#include <stdlib.h>
#include <stdint.h>
#include "secp256k1.h"

JNIEXPORT jlong JNICALL Java_org_bitcoin_Secp256k1Context_secp256k1InitContext
        (JNIEnv *env, jclass classObject) {
    secp256k1_context *ctx = secp256k1_context_create(
            SECP256K1_CONTEXT_SIGN | SECP256K1_CONTEXT_VERIFY);

    (void) classObject;
    (void) env;

    return (uintptr_t) ctx;
}

