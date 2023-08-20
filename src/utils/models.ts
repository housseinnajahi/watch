import { inv, multiply } from 'mathjs'

export class Watch {
    private time!: Time;
    private activeMode!: Boolean;
    private activatedMode!: String;
    private lightOn!: Boolean;
    private watchPosition!: Vector2D;
    private pivotPoint!: Vector2D;
    private angle!: number;
    private scalingX!: number;
    private scalingY!: number;
    private currentAngle: number = 0;

    constructor(timezone: string, watchPosition=new Vector2D(0,0), pivotPoint=new Vector2D(0,0), scalingX=0, scalingY=0, angle=0) {
        this.time = new Time(timezone);
        this.activeMode = false;
        this.activatedMode = 'M';
        this.lightOn = false
        this.watchPosition = watchPosition;
        this.pivotPoint = pivotPoint;
        this.scalingX = scalingX;
        this.scalingY = scalingY;
        this.angle = angle;
    }
    public getTime() {
        return this.time;
    }
    public changeMode() {
        if (this.activatedMode === 'M' && !this.activeMode) {
            this.activeMode = true;
            this.activatedMode = 'H';
        } else if (this.activatedMode === 'H' && this.activeMode) {
            this.activatedMode = 'M';
        } else if (this.activatedMode === 'M' && this.activeMode) {
            this.activeMode = false
        }
    }
    public updateTime() {
        if (this.activatedMode === 'H' && this.activeMode) {
            this.getTime().addHours(1);
        } else if (this.activatedMode === 'M' && this.activeMode) {
            this.getTime().addMinutes(1);
        }
    }
    public turnLight() {
        this.lightOn = !this.lightOn;
    }
    public resetTime() {
        this.time.resetTime();
    }
    public changeTimeFormat() {
        this.time.useTwelveHoursFormat();
    }
    public getWatchPosition() {
        return this.watchPosition;
    }
    public getPivotPoint() {
        return this.pivotPoint;
    }
    public getScalingX() {
        return this.scalingX;
    }
    public getScalingY() {
        return this.scalingY;
    }
    public getAngle() {
        return this.angle;
    }
    public animate() {
        let translationMatrix: Matrix3x3 = translation(this.pivotPoint);
        let rotationMatrix: Matrix3x3 = rotation(this.currentAngle);
        this.currentAngle += this.angle;
        let scalingMatrix = scaling(this.scalingX,this.scalingY);
        return translationMatrix.multiplyMatrix(rotationMatrix).multiplyMatrix(scalingMatrix).transform(this.watchPosition);
    }
    public resetPosition() {
        this.currentAngle = 0;
    }
}

export class Time {
    private hours!: number;
    private minutes!: number;
    private seconds!: number;
    private timezone!: string; 
    private twelveHourFormat!: Boolean;
    constructor(timezone: string) {
        this.timezone = timezone;
        let date = new Date();
        this.resetTime();
        this.twelveHourFormat = false;
    }

    public getHours() {
        return this.hours;
    }
    public getMinutes() {
        return this.minutes;
    }
    public getSeconds() {
        return this.seconds;
    }
    public setHours(hours: number) {
        this.hours = hours % 24;
    }
    public setMinutes(minutes: number) {
        this.minutes = minutes % 60;
    }
    public setSeconds(seconds: number) {
        this.seconds = seconds % 60;
    }
    public formatDate() {
        return [this.hours + ':' + this.minutes, this.seconds]
    }
    public getTimezone() {
        return this.timezone;
    }
    public setTimezone(timezone: string) {
        this.timezone = timezone;
    }
    public getTwelveHourFormat() {
        return this.twelveHourFormat;
    }
    public setTwelveHourFormat(twelveHourFormat: Boolean) {
        this.twelveHourFormat = twelveHourFormat;
    }
    public updateTime() {
        this.seconds += 1;
        this.minutes += this.seconds === 60 ? 1 : 0;
        this.hours += this.minutes === 60 ? 1 : 0;
        this.setHours(this.hours);
        this.setMinutes(this.minutes);
        this.setSeconds(this.seconds);
    }
    public addMinutes(minutes: number) {
        this.addHours(Math.floor((this.minutes + minutes)/60));
        this.setMinutes((this.minutes + minutes) % 60);
    }
    public addHours(hours: number) {
        this.setHours(this.hours + hours);
    }
    public formatTime(){
        let hours = this.twelveHourFormat ? this.format(this.hours % 12) : this.format(this.hours);
        let hoursFormat = this.twelveHourFormat ? this.hours >= 12 ? 'pm' : 'am' : '';
        return {
            hoursMinutes: hours + ':' + this.format(this.minutes),
            seconds: this.format(this.seconds),
            hoursFormat: hoursFormat
        }
    }
    public format(i: number){
        return i > 9 ? i.toString() : '0' + i.toString();
    }
    public resetTime() {
        let date = new Date();
        date = new Date(date.toLocaleString("en-US", {timeZone: this.timezone}));
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
    }
    public useTwelveHoursFormat() {
        this.twelveHourFormat = !this.twelveHourFormat;

    }
}

export class Vector2D {
    private x!: number;
    private y!: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public getX() {
        return this.x;
    }
    public setX(x: number) {
        this.x = x;
    }
    public getY() {
        return this.y;
    }
    public setY(y: number) {
        this.y = y;
    }
}

export class Matrix3x3 {
    private matrix!: number[][];
    constructor(data = [[0,0,0],[0,0,0],[0,0,0]]) {
        this.matrix = data;
    }
    public getMatrix() {
        return this.matrix;
    }
    public setMatrix(matrix: number[][]) {
        this.matrix = matrix;
    }
    public inverse() {
        try {
            return new Matrix3x3(inv(this.matrix));
        } catch (error) {
            console.error(error);
            return new Matrix3x3([[1,0,0],[0,1,0],[0,0,1]]);
        }
    }
    public multiplyMatrix(matrix: Matrix3x3) {
        return new Matrix3x3(multiply(this.matrix, matrix.getMatrix()));
    }
    public transform(vector: Vector2D) {
        let x1 = vector.getX() * this.matrix[0][0] + vector.getY() * this.matrix[0][1];
        let y1 = vector.getX() * this.matrix[1][0] + vector.getY() * this.matrix[1][1];
        return new Vector2D(x1, y1);
    }
}

export function translation(vector: Vector2D) {
    return new Matrix3x3([[1,0,vector.getX()],[0,1,vector.getY()],[0,0,1]]);
}

export function rotation(angle: number) {
    let radian = angle * (180/Math.PI);
    return new Matrix3x3([[Math.cos(radian),-Math.sin(radian),0],[Math.sin(radian),Math.cos(radian),0],[0,0,1]]);
}

export function scaling(scaleX: number, scaleY: number) {
    return new Matrix3x3([[scaleX,0,0],[0,scaleY,0],[0,0,1]]);
}