package com.reactnativesecp256k1urnm;

import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import org.bitcoin.NativeSecp256k1;
import org.bitcoin.NativeSecp256k1Util;

import java.security.SecureRandom;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@ReactModule(name = Secp256k1UrnmModule.NAME)
public class Secp256k1UrnmModule extends ReactContextBaseJavaModule {
  public static final String NAME = "Secp256k1Urnm";

  // this loads the library when the class is loaded
  static {
    System.loadLibrary("secp256k1");
    System.loadLibrary("bridge"); // this loads the library when the class is loaded
  }

  private final Executor executor = Executors.newSingleThreadExecutor();

  private final ReactApplicationContext reactContext;

  public Secp256k1UrnmModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    SecureRandom random = new SecureRandom();
    try {
      NativeSecp256k1.randomize(random.generateSeed(32));
    } catch (NativeSecp256k1Util.AssertFailException e) {
      e.printStackTrace();
    }
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void verify(final String data, final String signature, final String pub, final Promise promise) {
    executor.execute(() -> {
      try {
        byte[] dataraw = Base64.decode(data, Base64.NO_PADDING);
        byte[] signatureraw = Base64.decode(signature, Base64.NO_PADDING);
        byte[] pubraw = Base64.decode(pub, Base64.NO_PADDING);

        promise.resolve(NativeSecp256k1.verify(dataraw, signatureraw, pubraw));
      } catch (Exception ex) {
        ex.printStackTrace();
        promise.reject("Error", ex.toString());
      }

    });
  }

  @ReactMethod
  public void sign(final String data, final String priv, final Promise promise) {
    executor.execute(() -> {
      try {
        byte[] dataraw = Base64.decode(data, Base64.NO_PADDING);
        byte[] privraw = Base64.decode(priv, Base64.NO_PADDING);
        byte[] signatureraw = NativeSecp256k1.sign(dataraw, privraw);

        promise.resolve(Base64.encodeToString(signatureraw, Base64.NO_PADDING | Base64.NO_WRAP));
      } catch (Exception ex) {
        ex.printStackTrace();
        promise.reject("Error", ex.toString());
      }
    });
  }

  @ReactMethod
  public void secKeyVerify(final String priv, final Promise promise) {
    executor.execute(() -> {
      try {
        byte[] privraw = Base64.decode(priv, Base64.NO_PADDING);
        promise.resolve(NativeSecp256k1.secKeyVerify(privraw));
      } catch (Exception ex) {
        ex.printStackTrace();
        promise.reject("Error", ex.toString());
      }
    });
  }

  @ReactMethod
  public void computePubkey(final String priv, final boolean compressed, final Promise promise) {
    executor.execute(() -> {
      try {
        byte[] privraw = Base64.decode(priv, Base64.NO_PADDING);
        byte[] pubraw = NativeSecp256k1.computePubkey(privraw, compressed);
        promise.resolve(Base64.encodeToString(pubraw, Base64.NO_PADDING | Base64.NO_WRAP));
      } catch (Exception ex) {
        ex.printStackTrace();
        promise.reject("Error", ex.toString());
      }
    });
  }

  @ReactMethod
  public void createECDHSecret(final String priv, final String pub, final Promise promise) {
    executor.execute(() -> {
      try {
        byte[] privraw = Base64.decode(priv, Base64.NO_PADDING);
        byte[] pubraw = Base64.decode(pub, Base64.NO_PADDING);
        byte[] secretraw = NativeSecp256k1.createECDHSecret(privraw, pubraw);
        promise.resolve(Base64.encodeToString(secretraw, Base64.NO_PADDING | Base64.NO_WRAP));
      } catch (Exception ex) {
        ex.printStackTrace();
        promise.reject("Error", ex.toString());
      }
    });
  }

  @ReactMethod
  public void privKeyTweakMul(final String priv, final String tweak, final Promise promise) {
    executor.execute(() -> {
      try {
        byte[] privraw = Base64.decode(priv, Base64.NO_PADDING);
        byte[] tweakraw = Base64.decode(tweak, Base64.NO_PADDING);
        byte[] result = NativeSecp256k1.privKeyTweakMul(privraw, tweakraw);
        promise.resolve(Base64.encodeToString(result, Base64.NO_PADDING | Base64.NO_WRAP));
      } catch (Exception ex) {
        ex.printStackTrace();
        promise.reject("Error", ex.toString());
      }
    });
  }

  @ReactMethod
  public void privKeyTweakAdd(final String priv, final String tweak, final Promise promise) {
    executor.execute(() -> {
      try {
        byte[] privraw = Base64.decode(priv, Base64.NO_PADDING);
        byte[] tweakraw = Base64.decode(tweak, Base64.NO_PADDING);
        byte[] result = NativeSecp256k1.privKeyTweakAdd(privraw, tweakraw);
        promise.resolve(Base64.encodeToString(result, Base64.NO_PADDING | Base64.NO_WRAP));
      } catch (Exception ex) {
        ex.printStackTrace();
        promise.reject("Error", ex.toString());
      }
    });
  }

  @ReactMethod
  public void pubKeyTweakMul(final String pub, final String tweak, final Promise promise) {
    executor.execute(() -> {
      try {
        byte[] pubraw = Base64.decode(pub, Base64.NO_PADDING);
        byte[] tweakraw = Base64.decode(tweak, Base64.NO_PADDING);
        byte[] result = NativeSecp256k1.pubKeyTweakMul(pubraw, tweakraw);
        promise.resolve(Base64.encodeToString(result, Base64.NO_PADDING | Base64.NO_WRAP));
      } catch (Exception ex) {
        ex.printStackTrace();
        promise.reject("Error", ex.toString());
      }
    });
  }

  @ReactMethod
  public void pubKeyTweakAdd(final String pub, final String tweak, final Promise promise) {
    executor.execute(() -> {
      try {
        byte[] pubraw = Base64.decode(pub, Base64.NO_PADDING);
        byte[] tweakraw = Base64.decode(tweak, Base64.NO_PADDING);
        byte[] result = NativeSecp256k1.pubKeyTweakAdd(pubraw, tweakraw);
        promise.resolve(Base64.encodeToString(result, Base64.NO_PADDING | Base64.NO_WRAP));
      } catch (Exception ex) {
        ex.printStackTrace();
        promise.reject("Error", ex.toString());
      }
    });
  }
}
