import base64url from 'base64url';

import { verifyAttestationWithMetadata } from './verifyAttestationWithMetadata';
import { MetadataStatement } from '../metadata/mdsTypes';

test('should verify attestation with metadata (android-safetynet)', async () => {
  const metadataStatementJSONSafetyNet: MetadataStatement = {
    legalHeader: "https://fidoalliance.org/metadata/metadata-statement-legal-header/",
    aaguid: "b93fd961-f2e6-462f-b122-82002247de78",
    description: "Android Authenticator with SafetyNet Attestation",
    authenticatorVersion: 1,
    protocolFamily: "fido2",
    schema: 3,
    upv: [{ major: 1, minor: 0 }],
    authenticationAlgorithms: ["secp256r1_ecdsa_sha256_raw"],
    publicKeyAlgAndEncodings: ["cose"],
    attestationTypes: ["basic_full"],
    userVerificationDetails: [
      [{ userVerificationMethod: "faceprint_internal" }],
      [{ userVerificationMethod: "fingerprint_internal" }],
      [{ userVerificationMethod: "passcode_internal" }],
      [{ userVerificationMethod: "pattern_internal" }]
    ],
    keyProtection: ["hardware", "tee"],
    isKeyRestricted: false,
    matcherProtection: ["tee"],
    attachmentHint: ["internal"],
    tcDisplay: [],
    // Truncated from 28 to 1 to reduce test execution time
    attestationRootCertificates: [
      "MIIDdTCCAl2gAwIBAgILBAAAAAABFUtaw5QwDQYJKoZIhvcNAQEFBQAwVzELMAkGA1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExEDAOBgNVBAsTB1Jvb3QgQ0ExGzAZBgNVBAMTEkdsb2JhbFNpZ24gUm9vdCBDQTAeFw05ODA5MDExMjAwMDBaFw0yODAxMjgxMjAwMDBaMFcxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMRAwDgYDVQQLEwdSb290IENBMRswGQYDVQQDExJHbG9iYWxTaWduIFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDaDuaZjc6j40+Kfvvxi4Mla+pIH/EqsLmVEQS98GPR4mdmzxzdzxtIK+6NiY6arymAZavpxy0Sy6scTHAHoT0KMM0VjU/43dSMUBUc71DuxC73/OlS8pF94G3VNTCOXkNz8kHp1Wrjsok6Vjk4bwY8iGlbKk3Fp1S4bInMm/k8yuX9ifUSPJJ4ltbcdG6TRGHRjcdGsnUOhugZitVtbNV4FpWi6cgKOOvyJBNPc1STE4U6G7weNLWLBYy5d4ux2x8gkasJU26Qzns3dLlwR5EiUWMWea6xrkEmCMgZK9FGqkjWZCrXgzT/LCrBbBlDSgeF59N89iFo7+ryUp9/k5DPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRge2YaRQ2XyolQL30EzTSo//z9SzANBgkqhkiG9w0BAQUFAAOCAQEA1nPnfE920I2/7LqivjTFKDK1fPxsnCwrvQmeU79rXqoRSLblCKOzyj1hTdNGCbM+w6DjY1Ub8rrvrTnhQ7k4o+YviiY776BQVvnGCv04zcQLcFGUl5gE38NflNUVyRRBnMRddWQVDf9VMOyGj/8N7yy5Y0b2qvzfvGn9LhJIZJrglfCm7ymPAbEVtQwdpf5pLGkkeB6zpxxxYu7KyJesF12KwvhHhm4qxFYxldBniYUr+WymXUadDKqC5JlR3XC321Y9YeRq4VzW9v493kHMB65jUr9TU/Qr6cf9tveCX4XSQRjbgbMEHMUfpIBvFSDJ3gyICh3WZlXi/EjJKSZp4A==",
    ],
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7klEQVR4AaWPP2sUQRiHn5mdvexd/plEcvlDCi1E/EMabUWI9jaKWPoV/A7BQhAbG7t8CCUIKQQLuwhCUBsLBSUmGkLudm9n5nWHzMAego3P8Oy9s8vvfd+jzctPz2Ya+Zdbu48mG0ma8Eh8/bF3yWGGwPvV81d7+9/2lpy3Mrty7jswPPz8Yb20lQJ2iain2w9ok02aLURWstxuiHgknnrEK3GERg9poZ7s3CUxl/dvVfrntmRag9BuICJgrXfHnRvAWyJaDxXB+ezCWqX3t6e6i/ri/E1AkdBoLi/cZrL5pqeHb2yvu9RIUKfiWH95IVmmV6eucK1/j8JMIwRo6jNcX77P2vQ6ZEZ7OXreSFA93rnD3Mx6r7YfTxQKGkN4WP8eW7+bz4Z3eHEE9FFZAJXuliXVyUEfif9ZHINW+BQ5fSc+3oTjztTZRkx4LEhtfh1avBMSIkBrA+JvOAohm1AFgJGRpbOoXS/X1KXgHZE4X1Ssxpt18iYImGJiRFWWKCXkBdiR4L0QUEKamIKxhoQZm6fAdMDVjT7cQwBEYh3DSsl4A+trQTwJbUCsT5P+CodTZtYDmNJYcrEDQSChIMsVzoVQ2kLFMCCQFW4AoDbfbRDI7fIi5aAL41jtVNiQiPUjmUBOgAMCm683/ss/TaVXtx4qKMoAAAAASUVORK5CYII=",
    authenticatorGetInfo: {
      versions: ["FIDO_2_0"],
      aaguid: "b93fd961f2e6462fb12282002247de78",
      options: { plat: true, rk: true, uv: true },
    }
  };

  // Extracted from an actual android-safetynet response
  const x5c = [
    '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'
  ];
  const credentialPublicKey = 'pQECAyYgASFYIAKH2NrGZT-lUEA3tbBXR9owjW_7OnA1UqoL1UuKY_VCIlggpjeOH0xyBCpGDya55JLXXKrzyOieQN3dvG1pV-Qs-Gs';

  const verified = await verifyAttestationWithMetadata(
    metadataStatementJSONSafetyNet,
    base64url.toBuffer(credentialPublicKey),
    x5c,
  );

  expect(verified).toEqual(true);
});
