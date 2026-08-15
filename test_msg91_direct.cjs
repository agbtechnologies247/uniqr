async function testMsg91() {
  const authkey = '559789TIkWXRukUxN6a7db525P1';
  const mobile = '919049874780';
  const otp = '425246';

  console.log('--- TESTING MSG91 V5 OTP ---');
  try {
    const res1 = await fetch(`https://control.msg91.com/api/v5/otp?mobile=${mobile}&otp=${otp}&otp_expiry=10`, {
      method: 'POST',
      headers: { 'authkey': authkey, 'Content-Type': 'application/json' }
    });
    const data1 = await res1.json();
    console.log('V5 OTP Res:', data1);
  } catch (err) {
    console.error('V5 OTP Error:', err.message);
  }

  console.log('--- TESTING MSG91 V2 SEND SMS ---');
  try {
    const res2 = await fetch('https://api.msg91.com/api/v2/sendsms', {
      method: 'POST',
      headers: {
        'authkey': authkey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: 'UNIQR',
        route: '4',
        country: '91',
        sms: [
          {
            message: `Your UniQR verification code is ${otp}. Valid for 10 minutes.`,
            to: ['9049874780']
          }
        ]
      })
    });
    const data2 = await res2.json();
    console.log('V2 SendSMS Res:', data2);
  } catch (err) {
    console.error('V2 SendSMS Error:', err.message);
  }

  console.log('--- TESTING MSG91 GET OTP ---');
  try {
    const res3 = await fetch(`https://control.msg91.com/api/v5/otp?authkey=${authkey}&template_id=&extra_param=%7B%7D&mobile=${mobile}&otp=${otp}`, {
      method: 'GET'
    });
    const data3 = await res3.json();
    console.log('GET OTP Res:', data3);
  } catch (err) {
    console.error('GET OTP Error:', err.message);
  }
}

testMsg91();
