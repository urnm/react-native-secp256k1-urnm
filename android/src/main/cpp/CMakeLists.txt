cmake_minimum_required(VERSION 3.4.1)

add_compile_options(-fvisibility=hidden -w)
include_directories(${CMAKE_SOURCE_DIR}/../../../jni/include)

add_library(
  crypto_bridge
  SHARED
  crypto_bridge.cpp
  native-crypto.cpp
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

target_link_libraries(crypto_bridge secp256k1 android log)
