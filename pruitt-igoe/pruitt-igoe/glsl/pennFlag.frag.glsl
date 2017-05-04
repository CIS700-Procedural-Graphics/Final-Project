#version 150

uniform float Time;
uniform vec4 ScreenSize;

in vec2 uv;

out vec4 out_Col;

// Note: some of the functions are taken from mercury's HG_SDF
#define saturate(x) clamp(x, 0.0, 1.0)

float vmax(vec2 v) { return max(v.x, v.y); }

float fCircle(vec2 p, float r) { return length(p) - r; }

float fBox2(vec2 p, vec2 b) {
	vec2 d = abs(p) - b;
	float box = length(max(d, vec2(0))) + vmax(min(d, vec2(0)));    
    return box;
}

// Hashes from iq
float hash1( vec2 p )
{
    p  = 50.0 * fract(p * 0.3183099);
    return fract(p.x*p.y*(p.x+p.y));
}

float hash1( float n )
{
    return fract( n*17.0*fract( n*0.3183099 ) );
}

vec2 hash2( float n ) { return fract(sin(vec2(n,n+1.0))*vec2(43758.5453123,22578.1459123)); }


vec2 hash2( vec2 p ) 
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    p = p*k + k.yx;
    return fract( 16.0 * k*fract( p.x*p.y*(p.x+p.y)) );
}

float shieldSDF(vec2 uv, float scale) 
{
    uv *= 100.0 * scale;
    uv *= 1.75;
    float dist = fBox2((uv - vec2(0.0, 75.0) * scale), vec2(125.0, 75.0) * scale);
    
    float leftQuad = saturate(fBox2((uv - vec2(-62.5, -75.0) * scale), vec2(62.5, 75.0) * scale));
    dist = min(dist, max(leftQuad, fCircle((uv - vec2(52.5, 25.0) * scale), 180.0 * scale)));
    
    uv.x *= -1.0;
    leftQuad = saturate(fBox2((uv - vec2(-62.5, -75.0)* scale), vec2(62.5, 75.0) * scale));    
    dist = min(dist, max(leftQuad, fCircle((uv - vec2(52.5, 25.0)* scale), 180.0 * scale)));
    
    return dist;
}

float shield(vec2 uv) { return shieldSDF(uv, 1.0); }

float stripe(vec2 uv) { return step(24.0, abs((abs(uv.x) + uv.y - .05) * 100.0)); }

float book(vec2 uv)
{
    float dist = fBox2(uv, vec2(15.0, 15.0));
    
    dist = min(dist, fCircle(abs(uv - vec2(0.0, 4.0)) - vec2(13.0, 7.0), 4.5));
        
	return dist;
}

float innerBook(vec2 uv)
{
    uv.y -= pow(sin(uv.x * .3), 2.0) - 1.0 / (abs(uv.x * .2) + .25);
    return fBox2(uv - vec2(0.0, 5.0), vec2(11.0, 13.0));    
}

// Whyyyy did they choose a dolphin
float dolphin(vec2 uv)
{
    uv += vec2(0.0, .01);
    uv.x = uv.x * 1.15 - .05;
    vec2 baseUV = uv * 100.0;
    float boundary = fBox2(uv * 100.0 - vec2(0.0, 55.0), vec2(17.0, 18.0));  
    float y1 = sin(uv.x * 11.0 - 1.5) * .075;
    uv.y -= .525 - y1;
    uv.y *= 2.5 + saturate((uv.x * 4.0 + .45) * 1.0) * 3.0;
    uv.y += uv.x;
    uv *= 100.0;
    
    float base = smoothstep(23.0, 27.0, abs(uv.y) - .5);
    
    base = max(base, boundary);    
    base = smoothstep(.1, .95, base);
    return base;
}

float dolphinHead(vec2 uv)
{
    uv.x = uv.x * 1.15 - .05;
    vec2 baseUV = uv * 100.0;
    float head = fCircle(baseUV - vec2(-28.0, 65.0), 12.0);
    
    head = min(head, fCircle(baseUV - vec2(-15.0, 58.0), 4.0));
    head = min(head, fCircle(baseUV - vec2(-17.0, 50.0), 7.0));
    head = min(head, fCircle(baseUV - vec2(-27.0, 54.0), 9.0));
    
    // Masks
    head = max(head, fCircle(baseUV - vec2(-30.0, 80.0), 35.0));
    head = max(head, fCircle(baseUV - vec2(-10.0, 46.0), 23.0));
    
    head = min(head, fCircle(baseUV - vec2(-30.0, 51.5), 3.0));
    
    return head;
}

float dolphinMouth(vec2 uv)
{
    vec2 baseUV = uv * 200.0 - vec2(-38.0, 104.0);
    baseUV.y *= .9;
    baseUV.y += sin(baseUV.x * .175 + 2.0) * 1.75;
    
    float mouth = fBox2(baseUV, vec2(10.0, .5));
    
    float eye = fCircle(baseUV - vec2(1.0, 10.0), 3.0);
    eye = max(eye, fCircle(baseUV - vec2(-3.0, 17.0), 10.0));
    mouth = min(mouth, eye);
    
    baseUV = uv * 200.0 - vec2(3.0, 120.0);
    baseUV.y *= .9;
    baseUV.y += sin(baseUV.x * .65 + 2.0) * 1.75 + baseUV.x * baseUV.x * .03;
    float innerScales = fBox2(baseUV, vec2(15.0, 1.4));

    mouth = min(mouth, innerScales);
    
    return mouth;
}

float dolphinScales(vec2 uv)
{
    uv.x = uv.x * 1.15 - .05;
    vec2 baseUV = uv * 100.0;
        
    float scale = fCircle(baseUV - vec2(-15.0, 68.0), 4.0);
    scale = min(scale, fCircle(baseUV - vec2(-10.0, 70.0), 4.0));
    scale = min(scale, fCircle(baseUV - vec2(-5.0, 69.5), 4.0));    
    scale = min(scale, fCircle(baseUV - vec2(0.0, 68.5), 4.0)); 
    scale = min(scale, fCircle(baseUV - vec2(5.0, 64.5), 4.0));
    scale = min(scale, fCircle(baseUV - vec2(8.0, 60.5), 4.0));
    scale = min(scale, fCircle(baseUV - vec2(10.0, 55.5), 4.0));
    
    return scale;
}

float dolphinTail(vec2 uv)
{
    vec2 baseUV = uv * 100.0 - vec2(21.6, 57.0);
    baseUV.x *= 1.3;
    
    float tail = fCircle(baseUV - vec2(-5.0, 0.0), 11.2);
    tail = smoothstep(0.0, 4.0, tail * fCircle(baseUV - vec2(-5.0, 6.0), 10.5));
    
    float mask = fBox2(baseUV - vec2(3.0, -5.0), vec2(10.0, 7.0));
    tail = max(tail, mask);
    
    mask = fCircle(baseUV - vec2(0.195, 0.0), 13.0);
    tail = max(tail, mask);
    
    return tail * tail;
}

float dolphinTailEnd(vec2 uv)
{
    vec2 baseUV = uv * 150.0 - vec2(39.0, 88.0);
 
    float end = fCircle(baseUV - vec2(-10.0, 0.0), 11.95);
    end = end * fCircle(baseUV - vec2(-5.0, 6.0), 10.0);    
    
    float mask = fBox2(baseUV - vec2(-2.0, 10.0), vec2(10.0, 7.0));
   	end = max(end, mask);
    
    float end2 = fCircle(baseUV - vec2(10.0, 6.0), 13.0);
    end2 = end2* fCircle(baseUV - vec2(17.0, 6.0), 12.0);
    
    float mask2 = fBox2(baseUV - vec2(8.0, 14.0), vec2(7.0, 9.0));
   	end2 = max(end2, mask2);
    
    end = min(end, end2);
    
    return smoothstep(0.0, 2.0, end);
}

vec3 evaluateShieldColor(vec2 uv)
{
    vec3 whiteBorder = mix(vec3(1.0), vec3(0.0), shield(uv));
    
    float innerShieldMask = saturate(shield(uv * 1.065));
    
    vec3 blueBorder = mix(vec3(0, 0.294, 0.557), whiteBorder, innerShieldMask);
    vec3 innerWhite = mix(vec3(1.0), blueBorder, saturate(shield(uv * 1.125)));
    
    float upperQuad = saturate(fBox2((uv * 100.0 - vec2(0.0, 54.0)), vec2(63.5, 23.0)));
    vec3 upperRed = mix(vec3(0.706, 0.031, 0.22), innerWhite, upperQuad);
    
    vec2 bookMask = vec2(abs(uv.x), uv.y) * 110.0 - vec2(50.0, 60.0);
    vec3 books = mix(vec3(0, 0.294, 0.557), upperRed, saturate(book(bookMask)));
    books = mix(vec3(1.0), books, saturate(book(bookMask * 1.15)));
    
    // Inner book
    books = mix(vec3(0, 0.294, 0.557), books, saturate(innerBook(bookMask)));
    books = mix(vec3(1.0), books, saturate(innerBook(bookMask * 1.25 - vec2(0.0, 2.0))));
    books = mix(vec3(0, 0.294, 0.557), books, saturate(fBox2(bookMask - vec2(0.0, 4.0), vec2(1.0, 12.5))));
    
    upperQuad = saturate(fBox2((uv * 100.0 - vec2(0.0, 31.0)), vec2(64, 1.0)));
    vec3 upperBlueLine = mix(vec3(0, 0.294, 0.557), books, upperQuad); 
    
    vec3 blueStripe = mix(vec3(0, 0.294, 0.557), upperBlueLine, max(innerShieldMask, saturate(stripe(uv)))); 
    
    vec3 circles = mix(vec3(1.0), blueStripe, saturate(fCircle(uv * 200.0 + vec2(0.0, -2.5), 21.0)));
    circles = mix(vec3(1.0), circles, saturate(fCircle(uv * 200.0 + vec2(60.0, 50.0), 21.0)));
    circles = mix(vec3(1.0), circles, saturate(fCircle(uv * 200.0 + vec2(-60.0, 50.0), 21.0)));
    
    // Make fish smaller
    uv *= 1.3;
    uv += vec2(.025, -.1);
    vec3 dolphinColor = mix(vec3(0, 0.294, 0.557), circles, saturate(dolphinScales(uv * .935 + vec2(0.0, .02))));
    dolphinColor = mix(vec3(1.0), dolphinColor, saturate(dolphinScales(uv * 1.1 - vec2(0.0, .08))));
    
    float dolphinBase = saturate(dolphin(uv * vec2(.95, .94) + vec2(0.01, .005)));
    // We need to fix the connection...
    dolphinBase = max(dolphinBase, saturate(fBox2(uv * 100.0 - vec2(-0.0, 33.5), vec2(16.0, 40.0))));    
    dolphinBase = min(dolphinBase, saturate(dolphinTail(uv * vec2(.8, .77) + vec2(0.025, .105))));
    
    dolphinBase = min(dolphinBase, saturate(dolphinTailEnd(uv * vec2(.8, .75) + vec2(0.05, .17))));
    
	dolphinColor = mix(vec3(0, 0.294, 0.557), dolphinColor, dolphinBase);
    
    dolphinColor = mix(vec3(1.0), dolphinColor, saturate(dolphin(uv * vec2(1.075, 1.15) - vec2(0.0, .1225))));
    dolphinColor = mix(vec3(1.0), dolphinColor, saturate(dolphinTail(uv * .915 + vec2(0.0, .03))));
    
    dolphinColor = mix(vec3(0, 0.294, 0.557), dolphinColor, saturate(dolphinHead(uv * .915 + vec2(0.0, .03))));
    dolphinColor = mix(vec3(1.0), dolphinColor, saturate(dolphinHead(uv * 1.1 - vec2(-.025, .08))));
    
    dolphinColor = mix(vec3(0, 0.294, 0.557), dolphinColor, saturate(dolphinMouth(uv * .915 + vec2(0.0, .03))));
    
    dolphinColor = mix(vec3(1.0), dolphinColor, saturate(dolphinTailEnd(uv)));
    
    return dolphinColor;
}

// Uff I'll optimize it later
float worley(vec2 uv)
{
    uv += uv * sin(-Time * 2.0 + 7.0 * length(uv)) * .05;
    
    float scale = 5.0;
    vec2 p = floor(uv * scale);
    
    vec2 p1 = p + vec2(0.0, 0.0);
    p1 += hash2(p) * .5;
    
    vec2 p2 = p + vec2(1.0, 0.0);
    p2 += hash2(p2) * .5;
    
    vec2 p3 = p + vec2(1.0, 1.0);
    p3 += hash2(p3) * .5;
    
    vec2 p4 = p + vec2(0.0, 1.0);
    p4 += hash2(p4) * .5;

    vec2 p5 = p + vec2(-1.0, 0.0);
    p5 += hash2(p5) * .5;
    
    vec2 p6 = p + vec2(-1.0, -1.0);
    p6 += hash2(p6) * .5;
    
    vec2 p7 = p + vec2(0.0, -1.0);
    p7 += hash2(p7) * .5;
    
    vec2 p8 = p + vec2(-1.0, 1.0);
    p8 += hash2(p8) * .5;
    
    vec2 p9 = p + vec2(1.0, -1.0);
    p9 += hash2(p9) * .5;
    
    p = uv * scale;
    
    float d1 = length(p - p1);
    float d2 = length(p - p2);
    float d3 = length(p - p3);
    float d4 = length(p - p4);
    float d5 = length(p - p5);
    float d6 = length(p - p6);
    float d7 = length(p - p7);
    float d8 = length(p - p8);
    float d9 = length(p - p9);
    
    float d = d1;
    d = min(d, d2);
    d = min(d, d3);
    d = min(d, d4);
    d = min(d, d5);
    d = min(d, d6);
    d = min(d, d7);
    d = min(d, d8);
    d = min(d, d9);
    
    float c = mix(0.0, p1.x - floor(p1.x), step(abs(d - d1), 0.0));
    
    c = mix(c, p2.x - floor(p2.x), step(abs(d - d2), 0.0));
    c = mix(c, p3.x - floor(p3.x), step(abs(d - d3), 0.0));
    c = mix(c, p4.x - floor(p4.x), step(abs(d - d4), 0.0));
    c = mix(c, p5.x - floor(p5.x), step(abs(d - d5), 0.0));    
    c = mix(c, p6.x - floor(p6.x), step(abs(d - d6), 0.0));
    c = mix(c, p7.x - floor(p7.x), step(abs(d - d7), 0.0));
    c = mix(c, p8.x - floor(p8.x), step(abs(d - d8), 0.0));
    c = mix(c, p9.x - floor(p9.x), step(abs(d - d9), 0.0));
    
    return c;
}

vec3 background(vec2 uv)
{   
    float dist = fBox2(uv, vec2(.15)) * .65;
    vec3 color = mix(vec3(0.169, 0.322, 0.49) * 1.5, vec3(0, 0.11, 0.298), saturate(vec3(dist)));    
    float shadow = smoothstep(0.0, 1.0, .35 + shieldSDF(uv, .001) * 50.0);
       
    float voronoi = 1.75 * (worley(uv) + .35);
    return voronoi * color * shadow;
}

void main()
{
	float aspect = ScreenSize.x / ScreenSize.y;
    
	vec2 fixUV = uv * 2.0 - vec2(1.0);
    fixUV.x *= aspect;
    
    vec3 bgColor = background(fixUV);
    vec3 shieldColor = evaluateShieldColor(fixUV);
    
    vec3 outColor = mix(shieldColor, bgColor, saturate(shield(fixUV)));
    
    out_Col = vec4(outColor, 1.0);
}
