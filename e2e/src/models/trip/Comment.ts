import { by, ElementFinder } from 'protractor';


export class Comment {

    static LOCATOR = by.className('comment');

    private author: ElementFinder;
    private timestamp: ElementFinder;
    private content: ElementFinder;

    constructor(commentRoot: ElementFinder) {
        this.author = commentRoot.element(by.className('author'));
        this.timestamp = commentRoot.element(by.className('timestamp'));
        this.content = commentRoot.element(by.className('content'));
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
