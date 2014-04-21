var NT = {
    mod: function(n, m) {
        return ((n % m) + m) % m;
    },

    // finds a solution over integers to ax + by = gcd(a,b). returns g, x, y.
    lineq: function(a,b) {
        if (b == 0) return {g:a, x:1, y:0};
        var x = 1;
        var g = a;
        var v = 0;
        var w = b;
        var q, r, s;
        while (w != 0) {
            q = Math.floor(g/w);
            r = NT.mod(g,w);
            s = x - q*v;
            x = v;
            g = w;
            v = s;
            w = r;
        }
        var y = (g-a*x)/b
        if (g < 0) {
            g = -g;
            x = -x;
            y = -y;
        }
        return {g:g, x:x, y:y}
    },
    
    // modular inverse
    inv: function(a, m) {
        eq = NT.lineq(a, m);
        if (eq.g != 1) {
            return NaN;
        }
        return NT.mod(eq.x, m);
    },
    
    powMod: function(base, exp, m) {
        if (exp == 0 && base == 0) return NaN;
        if (exp == 0) return 1;
        if (exp > 0 && base == 0) return 0;
        if (exp < 0) { 
            var i = NT.inv(base,m);
            if (i == NaN) return NaN;
            return NT.powMod(i, -exp, m);
        }
        if (exp % 2 == 0) {
            return NT.mod(Math.pow(NT.powMod(base, exp/2, m), 2),m);
        } else {
            return NT.mod((base * NT.powMod(base, exp-1, m)),m);
    }
}   

}