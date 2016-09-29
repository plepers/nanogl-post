
c += c * (uGrainScaleBias.x * texture2D(tGrain,texCoordVP*uGrainCoord.xy+uGrainCoord.zw).x+uGrainScaleBias.y);