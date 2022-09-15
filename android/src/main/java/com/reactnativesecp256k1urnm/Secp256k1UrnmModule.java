package com.reactnativesecp256k1urnm;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = Secp256k1UrnmModule.NAME)
public class Secp256k1UrnmModule extends ReactContextBaseJavaModule {
  public static final String NAME = "Secp256k1Urnm";

  static {
    System.loadLibrary("secp256k1");
    System.loadLibrary("crypto_bridge");
  }

  public native String secp256k1EcPubkeyCreateJNI(String privateKeyHex, int compressed);

  public native String secp256k1EcPrivkeyTweakAddJNI(String privateKeyHex, String tweakHex);

  public native String secp256k1EcPubkeyTweakAddJNI(String publicKeyHex, String tweakHex, int compressed);


  public Secp256k1UrnmModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void secp256k1EcPubkeyCreate(String privateKeyHex, Boolean compressed, Promise promise) {
    int iCompressed = compressed ? 1 : 0;
    try {
      String reply =
        secp256k1EcPubkeyCreateJNI(privateKeyHex, iCompressed); // test response from JNI
      promise.resolve(reply);
    } catch (Exception e) {
      promise.reject("Err", e);
    }
  }

  @ReactMethod
  public void secp256k1EcPrivkeyTweakAdd(String privateKeyHex, String tweakHex, Promise promise) {
    try {
      String reply =
        secp256k1EcPrivkeyTweakAddJNI(privateKeyHex, tweakHex); // test response from JNI
      promise.resolve(reply);
    } catch (Exception e) {
      promise.reject("Err", e);
    }
  }

  @ReactMethod
  public void secp256k1EcPubkeyTweakAdd(
    String publicKeyHex, String tweakHex, Boolean compressed, Promise promise) {
    int iCompressed = compressed ? 1 : 0;
    try {
      String reply =
        secp256k1EcPubkeyTweakAddJNI(
          publicKeyHex, tweakHex, iCompressed); // test response from JNI
      promise.resolve(reply);
    } catch (Exception e) {
      promise.reject("Err", e);
    }
  }
}
