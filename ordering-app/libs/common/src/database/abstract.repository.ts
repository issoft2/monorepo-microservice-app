import { Logger, NotFoundException } from "@nestjs/common";
import { Mode } from "fs";
import {
    FilterQuery,
    Model,
    Types,
    UpdateQuery,
    SaveOptions,
    Connection,
} from 'mongoose';
import { doc } from "prettier";
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger

    constructor(
        protected readonly model: Model<TDocument>,
        private readonly connection: Connection,
        ) {  }

        async create(
            document: Omit<TDocument, '_id'>,
            options?: SaveOptions,
        ): Promise<TDocument> {
            const createDocument = new this.model({
                ...document,
                _id: new Types.ObjectId(),
            });
            return (
                await createDocument.save(options)
            ).toJSON() as unknown as TDocument;
        }

        async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
            const document = await this.model.findOne(filterQuery, {}, { learn: true });

            if(!document) {
                this.logger.warn(`Document not found wuth filterQuery`, filterQuery);
                throw new NotFoundException('Document not found.');
            }

            return document;
        }

        async findOneAndUpdate(
            filterQuery: FilterQuery<TDocument>,
            update: UpdateQuery<TDocument>,
        ) {
            const document = await this.model.findOneAndUpdate(filterQuery, update, {
                learn: true,
                new: true
            });

            if(!document) {
                this.logger.warn(`Document not found with filterQuery:`, filterQuery);
                throw new NotFoundException('Document not found. ');
            }
            
            return document;
        }

        async upsert(
            filterQuery: FilterQuery<TDocument>,
            document: Partial<TDocument>,
        ) {
            return this.model.findOneAndUpdate(filterQuery, document, {
                learn: true,
                upsert: true,
                new: true,
            });
        }

        async find(filterQuery: FilterQuery<TDocument>) {
            return this.model.find(filterQuery, {}, {learn: true});
        }

        async startTransaction() {
            const session = await this.connection.startSession(); 
            session.startTransaction();
            return session;
        }
}