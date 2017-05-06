#ifndef LOG_H
#define LOG_H

#include "../common.h"
#include <vector>
#include <queue>
#include <unordered_map>
#include <iostream>
#include <mutex>

class LogListener
{
public:
    virtual void OnLogFlush() = 0;
};

class Log
{
public:
    enum LogLevel
    {
        None = 0,
        Error = 1, // Plain errors
        Warning = 2, // Warnings to the user
        Info = 3, // Data that may be interesting to an user
        Debug = 4, // For debugging data, etc
        Verbose = 5 // Just throw whatever you want
    };

protected:
    std::ostream * stream;
    std::unordered_map<unsigned int, std::queue<std::string>> data;
    LogLevel currentLogLevel;
    LogListener * listener; // One for now...

    std::string GetLevelString(LogLevel l);

    void LogLine(LogLevel key, const std::string& message, const std::string& prepend, const std::string& append);

public:

    Log(std::ostream * stream);
    ~Log();

    void SetListener(LogListener * listener);

    virtual void SetLogLevel(LogLevel level);
    virtual void LogLine(LogLevel key, const std::string& message);
    virtual void Flush(LogLevel key);
    virtual void FlushAll();

    std::ostream * GetStream();
};

class MultiLog : public Log
{
private:
    std::vector<Log*> loggers;

public:
    MultiLog();

    void AddLogger(Log* l);

    void SetLogLevel(LogLevel level);
    void LogLine(LogLevel key, const std::string &message);
    void Flush(LogLevel key);
    void FlushAll();
};

class RichTextLog : public Log
{
public:
    RichTextLog(std::ostream * stream);
    std::string GetLineColor(LogLevel key);
    void LogLine(LogLevel key, const std::string &message);
};

// Wraps any logger and makes it thread safe in a very naive way
template <class T>
class ConcurrentLog : public Log
{
private:
    T * logger;
    std::mutex mutex;

public:
    ConcurrentLog(T * logger) : Log(nullptr), logger(logger) {}

    void SetLogLevel(LogLevel level)
    {
        mutex.lock();
        logger->SetLogLevel(level);
        mutex.unlock();
    }

    void LogLine(LogLevel key, const std::string &message)
    {
        mutex.lock();
        logger->LogLine(key, message);
        mutex.unlock();
    }

    void Flush(LogLevel key)
    {
        mutex.lock();
        logger->Flush(key);
        mutex.unlock();
    }

    void FlushAll()
    {
        mutex.lock();
        logger->FlushAll();
        mutex.unlock();
    }

    T * GetInternalLogger()
    {
        return logger;
    }
};


#endif // LOG_H
