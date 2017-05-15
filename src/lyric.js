import Character from './character'

//TODO: Rewrite alignment algorithm
Lyric.prototype.getLyricLineMesh = function(lyric, camera) {
    
    lyric = lyric.toUpperCase();
    
    var re = /\S+/g;
    var strArray = lyric.match(re) || [];

    var lyrics2d = [];
    var currentLine = 0;
    
    //TODO: Get rid of magic numbers, should be based on camera's intial position
    //y min is positive because top of screen is positive and bottom is negative
    var min = glm.vec3(-15,10,0);
    var max = glm.vec3(13,-5,0);
    var offset = glm.vec3(min[0],0,0);
    var lyricMesh = [];
    var whitespace = this.characters.letterWidth + this.letterSpacing;
    
    for (var i = 0; i < strArray.length; i++) {
             
        var word = strArray[i];
        var len = this.getWordLength(word);
        //if word doens't fit in same line move it to the next line
        if (len + whitespace + offset[0] >= max[0]) {
            
            //if word is too long and no words are present in current line
            //add it to current line anyways
            if ("undefined" === typeof lyrics2d[currentLine]) {
                lyrics2d[currentLine] = [word];
                offset[0] = min[0];
                offset[1] -= this.characters.letterHeight + this.lineSpacing;
                currentLine++;
                continue;
            }
            
            offset[0] = min[0];
            offset[1] -= this.characters.letterHeight + this.lineSpacing;
            currentLine++;
        }
        
        if ("undefined" === typeof lyrics2d[currentLine])
            lyrics2d[currentLine] = [];
        
            
        lyrics2d[currentLine].push(word);
        offset[0] += len;         
        //Add whitespace after word
        if (i != strArray.length-1)
            offset[0] += whitespace;
    }
        
    var lineHeight = lyrics2d.length * (this.characters.letterHeight + this.lineSpacing);
    var emptyHeightSpace = (min.y + Math.abs(max.y)) - lineHeight;
    var offsetFromTop = Math.min(min.y-emptyHeightSpace/2.0, min.y);

    offset = glm.vec3(0,offsetFromTop,0);

    for (var l = 0; l < lyrics2d.length; l++) {
        
        var line = lyrics2d[l];
        var lineWidth = 0;
        
        for (var w = 0; w < line.length; w++) {
            var word = line[w];
            lineWidth += this.getWordLength(word);
            //for whitespace
            if (w != line.length-1)
                lineWidth += whitespace;
        }

        var emptyWidthSpace = (Math.abs(min.x) + max.x) - lineWidth;
        //console.log(emptyWidthSpace);
        var offsetFromLeft = Math.max(min.x+emptyWidthSpace/2.0, min.x);
        //console.log(offsetFromLeft);
        offset[0] = offsetFromLeft;

        for (var w = 0; w < line.length; w++) {
            var word = line[w];
            lyricMesh = lyricMesh.concat(this.getWordMeshArray(word, offset));  
            //Add whitespace after word
            if (w != line.length-1)
                offset[0] += whitespace;
        }
        offset[1] -= this.characters.letterHeight + this.lineSpacing;
    }
    
    return lyricMesh;    
}



Lyric.prototype.getWordMeshArray = function(word, offset) {
    
    var lyricMesh = [];
    
    for (var l = 0; l < word.length; l++) {
         
         switch(word.charAt(l)) {
            case 'A':
                lyricMesh = lyricMesh.concat(this.characters.A(offset));
                break;
            case 'B':
                lyricMesh = lyricMesh.concat(this.characters.B(offset));
                break;
            case 'C':
                lyricMesh = lyricMesh.concat(this.characters.C(offset));
                break;
            case 'D':
                lyricMesh = lyricMesh.concat(this.characters.D(offset));
                break;
            case 'E':
                lyricMesh = lyricMesh.concat(this.characters.E(offset));
                break;
            case 'F':
                lyricMesh = lyricMesh.concat(this.characters.F(offset));
                break;
            case 'G':
                lyricMesh = lyricMesh.concat(this.characters.G(offset));
                break;
            case 'H':
                lyricMesh = lyricMesh.concat(this.characters.H(offset));
                break;
            case 'I':
                lyricMesh = lyricMesh.concat(this.characters.I(offset));
                break;
            case 'J':
                lyricMesh = lyricMesh.concat(this.characters.J(offset));
                break;
            case 'K':
                lyricMesh = lyricMesh.concat(this.characters.K(offset));
                break;
            case 'L':
                lyricMesh = lyricMesh.concat(this.characters.L(offset));
                break;
            case 'M':
                lyricMesh = lyricMesh.concat(this.characters.M(offset));
                break;
            case 'N':
                lyricMesh = lyricMesh.concat(this.characters.N(offset));
                break;
            case 'O':
                lyricMesh = lyricMesh.concat(this.characters.O(offset));
                break;
            case 'P':
                lyricMesh = lyricMesh.concat(this.characters.P(offset));
                break;
            case 'Q':
                lyricMesh = lyricMesh.concat(this.characters.Q(offset));
                break;
            case 'R':
                lyricMesh = lyricMesh.concat(this.characters.R(offset));
                break;
            case 'S':
                lyricMesh = lyricMesh.concat(this.characters.S(offset));
                break;
            case 'T':
                lyricMesh = lyricMesh.concat(this.characters.T(offset));
                break;
            case 'U':
                lyricMesh = lyricMesh.concat(this.characters.U(offset));
                break;
            case 'V':
                lyricMesh = lyricMesh.concat(this.characters.V(offset));
                break;
            case 'W':
                lyricMesh = lyricMesh.concat(this.characters.W(offset));
                break;
            case 'X':
                lyricMesh = lyricMesh.concat(this.characters.X(offset));
                break;
            case 'Y':
                lyricMesh = lyricMesh.concat(this.characters.Y(offset));
                break;
            case 'Z':
                lyricMesh = lyricMesh.concat(this.characters.Z(offset));
                break;
            case '0':
                lyricMesh = lyricMesh.concat(this.characters.zero(offset));
                break;
            case '1':
                lyricMesh = lyricMesh.concat(this.characters.one(offset));
                break;
            case '2':
                lyricMesh = lyricMesh.concat(this.characters.two(offset));
                break;
            case '3':
                lyricMesh = lyricMesh.concat(this.characters.three(offset));
                break;
            case '4':
                lyricMesh = lyricMesh.concat(this.characters.four(offset));
                break;
            case '5':
                lyricMesh = lyricMesh.concat(this.characters.five(offset));
                break;
            case '6':
                lyricMesh = lyricMesh.concat(this.characters.six(offset));
                break;
            case '7':
                lyricMesh = lyricMesh.concat(this.characters.seven(offset));
                break;
            case '8':
                lyricMesh = lyricMesh.concat(this.characters.eight(offset));
                break;
            case '9':
                lyricMesh = lyricMesh.concat(this.characters.nine(offset));
                break;
            case '\'':
                lyricMesh = lyricMesh.concat(this.characters.apostrophe(offset));
                break;
            case '\’':
                lyricMesh = lyricMesh.concat(this.characters.apostrophe(offset));
                break;
            case ',':
                lyricMesh = lyricMesh.concat(this.characters.comma(offset));
                break;
            case '.':
                lyricMesh = lyricMesh.concat(this.characters.period(offset));
                break;
            case '-':
                lyricMesh = lyricMesh.concat(this.characters.hyphen(offset));
                break;    
            case '&':
                lyricMesh = lyricMesh.concat(this.characters.ampersand(offset));
                break;
            case '\"':
                lyricMesh = lyricMesh.concat(this.characters.doubleQuotation(offset));
                break;
            case '\[':
                lyricMesh = lyricMesh.concat(this.characters.leftBracket(offset));
                break;
            case '\]':
                lyricMesh = lyricMesh.concat(this.characters.rightBracket(offset));
                break;    
            case '\(':
                lyricMesh = lyricMesh.concat(this.characters.leftParenthesis(offset));
                break;
            case '\)':
                lyricMesh = lyricMesh.concat(this.characters.rightParenthesis(offset));
                break;
            case ':':
                lyricMesh = lyricMesh.concat(this.characters.colon(offset));
                break;            
            case ';':
                lyricMesh = lyricMesh.concat(this.characters.semiColon(offset));
                break;
            default:
                break;
        }
        
        offset[0] += this.characters.letterWidth + this.letterSpacing;
    }
    
    return lyricMesh;
}


Lyric.prototype.getWordLength = function (word) {

    return (word.length-1) * (this.characters.letterWidth + this.letterSpacing);
}


export default function Lyric() { 
    
    this.letterSpacing = 0.3;
    this.lineSpacing = 0.5;

    this.characters = new Character();  
}