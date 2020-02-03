import { by, ElementFinder } from 'protractor';


export class Comment {

    static ELEMENT = by.className('comment');

    private author: ElementFinder;
    private timestamp: ElementFinder;
    private content: ElementFinder;

    constructor(root: ElementFinder) {
        this.author = root.element(by.className('author'));
        this.timestamp = root.element(by.className('timestamp'));
        this.content = root.element(by.className('content'));
    }

    getAuthor(): Promise<string> {
        return this.author.getText() as Promise<string>;
    }

    getTimestamp(): Promise<string> {
        return this.timestamp.getText() as Promise<string>;
    }

    getContent(): Promise<string> {
        return this.content.getText() as Promise<string>;
    }

}
