# Aponar Nihon — Play Store Release Checklist

## Already prepared in the repository
- Android Trusted Web Activity project under `android/`
- Package ID: `com.aponarnihon.app`
- Target SDK: 36
- Android Browser Helper: 2.7.2
- GitHub Actions Android build workflow
- Privacy Policy
- Account deletion page + authenticated Supabase deletion backend
- Store listing copy
- Data Safety draft

## Manual Play Console steps that cannot be completed from the source repository
1. Create/verify Google Play Console developer account.
2. Create a new app named **Aponar Nihon** with package ID `com.aponarnihon.app`.
3. Enroll in Play App Signing.
4. Copy the **App signing key certificate SHA-256 fingerprint** from Play Console.
5. Add that SHA-256 fingerprint to `/.well-known/assetlinks.json` on the website.
6. Add Android signing/upload-key GitHub repository secrets if using GitHub Actions for signed AAB builds:
   - `ANDROID_KEYSTORE_BASE64`
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`
7. Upload the signed `.aab` to Internal/Closed testing.
8. Fill App content: Privacy Policy, Data Safety, Ads declaration, Target audience, Content rating, App access.
9. Upload store icon, feature graphic and screenshots.
10. If the developer account is a new Personal account subject to Google testing requirements, keep at least 12 testers opted in to Closed testing continuously for 14 days, then apply for Production access.

## Digital Asset Links
TWA full-screen verification requires the Play signing certificate fingerprint. The production JSON must look like:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.aponarnihon.app",
      "sha256_cert_fingerprints": [
        "PLAY_APP_SIGNING_SHA256_HERE"
      ]
    }
  }
]
```

## Versioning
For every Play update, increment `versionCode` in `android/app/build.gradle`. `versionName` is user-facing and can follow semantic versions such as `1.0.1`.
