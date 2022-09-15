cmake_minimum_required(VERSION 3.4.1)
project(NativeSecp256k1)

#set(CMAKE_C_STANDARD 90)
#set(CMAKE_C_STANDARD_REQUIRED ON)

#add_definitions(-DUSE_NUM_NONE=1)
#add_definitions(-DUSE_FIELD_INV_BUILTIN=1)
#add_definitions(-DUSE_SCALAR_INV_BUILTIN=1)
#add_definitions(-DUSE_FIELD_10X26=1)
#add_definitions(-DUSE_SCALAR_8X32=1)
#add_definitions(-DENABLE_MODULE_ECDH=1)
#add_definitions(-DENABLE_MODULE_RECOVERY=1)
add_compile_options(-fvisibility=hidden -w)
include_directories(${CMAKE_SOURCE_DIR}/../../../jni/include)

add_library(
        bridge
        SHARED
        org_bitcoin_NativeSecp256k1.c
        org_bitcoin_Secp256k1Context.c
)

add_library(
        secp256k1
        SHARED
        IMPORTED
)

set_target_properties(
        secp256k1
        PROPERTIES
        IMPORTED_LOCATION
        ${CMAKE_SOURCE_DIR}/../../../jni/libs/${ANDROID_ABI}/libsecp256k1.so
)

target_link_libraries(bridge secp256k1)
