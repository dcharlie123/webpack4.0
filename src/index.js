import './css/style.css';
import './css/common.less';

console.log(111);
const a = 'hello';
console.log(a);
console.log($);
console.log(NODE_ENV);
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.a="aaa"
    };
    getX() {
        return this.x;
    }
}