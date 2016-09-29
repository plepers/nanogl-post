
c = max(vec3(0.0), c-0.004 );

c = (c * ( 0.275*c + 0.0375 ) + 0.0025 )
  / (c * ( 0.22*c + 0.3 ) + 0.06 )
  - 0.04166;

// http://www.smu.edu/~/media/Site/guildhall/Documents/Theses/Heysse_Thesis.ashx?la=en
// http://filmicgames.com/archives/75

   // float3 texColor = tex2D(Texture0, texCoord );
   // texColor *= 16;  // Hardcoded Exposure Adjustment
   // float3 x = max(0,texColor-0.004);
   // float3 retColor = (x*(6.2*x+.5))/(x*(6.2*x+1.7)+0.06);
   // return float4(retColor,1);


// float A = 0.15;
// float B = 0.50;
// float C = 0.10;
// float D = 0.20;
// float E = 0.02;
// float F = 0.30;
// float W = 11.2;

// float3 Uncharted2Tonemap(float3 x)
// {
//    return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
// }

// float4 ps_main( float2 texCoord  : TEXCOORD0 ) : COLOR
// {
//    float3 texColor = tex2D(Texture0, texCoord );
//    texColor *= 16;  // Hardcoded Exposure Adjustment

//    float ExposureBias = 2.0f;
//    float3 curr = Uncharted2Tonemap(ExposureBias*texColor);

//    float3 whiteScale = 1.0f/Uncharted2Tonemap(W);
//    float3 color = curr*whiteScale;

//    float3 retColor = pow(color,1/2.2);
//    return float4(retColor,1);
// }