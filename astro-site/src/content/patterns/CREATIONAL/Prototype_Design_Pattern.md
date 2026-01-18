---
title: Prototype Design Pattern
description: Create new objects by copying existing objects instead of instantiating new ones
category: Creational
tags: [gof, creational, prototype]
---
# The Prototype Pattern: Why Create When You Can Clone?

Here's a question that'll make you think: what's more expensive, building a car from scratch or copying an existing one? If you had a perfect duplicating machine, you'd just copy the car, right?

That's the Prototype pattern in a nutshell. Instead of creating objects from scratch every time, you copy existing ones.

## The Problem: Expensive Object Creation

Imagine you're building a game with complex enemy characters. Each enemy has:
- 3D model data
- AI behavior configurations  
- Weapon loadouts
- Armor statistics
- Animation states
- Particle effects

Creating one of these from scratch is slow. You need to:
- Load assets from disk
- Initialize complex data structures
- Set up relationships between components
- Configure default states

Now imagine you need to create 100 of these enemies in rapid succession. Creating each one from scratch would tank your frame rate.

But what if enemy number 2 through 100 are basically the same as enemy number 1, just with tiny variations? Why rebuild everything when you can copy?

## What Is the Prototype Pattern?

The Prototype pattern lets you create new objects by copying existing ones (prototypes) rather than creating them from scratch.

Think of it like:
- Photocopying a document instead of retyping it
- Cloning a sheep instead of... well, the natural way
- Duplicating a layer in Photoshop instead of recreating it

You start with a prototype object, clone it, and then tweak the copy as needed.

## When Does This Actually Matter?

Use Prototype when:
- Object creation is expensive (lots of computation, database queries, file I/O)
- You need many similar objects with slight variations
- You want to avoid complex initialization logic
- The cost of copying is significantly less than creating

Real-world examples:
- Game characters (same type, different positions/stats)
- Document templates
- Database records with similar structure
- UI components with similar configurations
- Machine learning models (copy base model, fine-tune for specific tasks)

## The Basic Implementation

Java provides a `Cloneable` interface and `clone()` method, but let's build from scratch to understand what's happening.

### Step 1: Define the Prototype Interface

```java
public interface Prototype {
    Prototype clone();
}
```

Simple. Any class that can be cloned must implement this.

### Step 2: Create a Concrete Prototype

Let's build that game enemy:

```java
public class Enemy implements Prototype {
    
    private String name;
    private int health;
    private int attackPower;
    private String weaponType;
    private Position position;
    
    public Enemy(String name, int health, int attackPower, String weaponType) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
        this.weaponType = weaponType;
        this.position = new Position(0, 0);
        
        // Imagine expensive initialization here
        loadComplexAIBehavior();
        loadAnimations();
        initializePhysics();
    }
    
    // Copy constructor - this is the magic
    private Enemy(Enemy other) {
        this.name = other.name;
        this.health = other.health;
        this.attackPower = other.attackPower;
        this.weaponType = other.weaponType;
        // Create a new position, don't share the reference
        this.position = new Position(other.position.x, other.position.y);
        
        // These expensive operations aren't repeated!
        // We're just copying the already-initialized data
    }
    
    @Override
    public Prototype clone() {
        return new Enemy(this);
    }
    
    // Expensive initialization methods
    private void loadComplexAIBehavior() {
        // Imagine loading from files, parsing configs, etc.
        System.out.println("Loading AI behavior... (expensive!)");
    }
    
    private void loadAnimations() {
        System.out.println("Loading animations... (expensive!)");
    }
    
    private void initializePhysics() {
        System.out.println("Initializing physics... (expensive!)");
    }
    
    // Setters for customization after cloning
    public void setPosition(int x, int y) {
        this.position.x = x;
        this.position.y = y;
    }
    
    public void setHealth(int health) {
        this.health = health;
    }
}
```

### Step 3: Using the Prototype

```java
public class Game {
    public static void main(String[] args) {
        
        // Create the first enemy (expensive)
        System.out.println("Creating prototype enemy:");
        Enemy prototypeEnemy = new Enemy("Orc", 100, 20, "Sword");
        
        // Clone the enemy (cheap)
        System.out.println("\nCloning enemies:");
        Enemy enemy1 = (Enemy) prototypeEnemy.clone();
        enemy1.setPosition(10, 20);
        
        Enemy enemy2 = (Enemy) prototypeEnemy.clone();
        enemy2.setPosition(15, 25);
        enemy2.setHealth(80);  // Slightly different
        
        Enemy enemy3 = (Enemy) prototypeEnemy.clone();
        enemy3.setPosition(20, 30);
        
        // No expensive initialization for clones!
    }
}
```

Output:
```
Creating prototype enemy:
Loading AI behavior... (expensive!)
Loading animations... (expensive!)
Initializing physics... (expensive!)

Cloning enemies:
(Three clones created instantly with no expensive operations!)
```

## The Two Types of Cloning: Shallow vs Deep

This is where things get interesting and where most bugs happen.

### Shallow Copy: Copying References

```java
private Enemy(Enemy other) {
    this.name = other.name;
    this.position = other.position;  // Sharing the SAME position object!
}
```

Problem: If you change `enemy1.position.x`, you're changing `enemy2.position.x` too because they're sharing the same Position object.

### Deep Copy: Copying Everything

```java
private Enemy(Enemy other) {
    this.name = other.name;
    // Create a NEW position object with the same values
    this.position = new Position(other.position.x, other.position.y);
}
```

Now each enemy has its own independent position.

### Which One Should You Use?

It depends on whether the objects should be shared or independent.

**Use shallow copy when:**
- The shared object is immutable (like String)
- You want objects to share the same reference
- Changes to one should affect all

**Use deep copy when:**
- Objects should be independent
- Changes to one shouldn't affect others
- You want complete isolation

Rule of thumb: if you're unsure, use deep copy. Shared state bugs are nightmares to debug.

## Using Java's Built-In Cloneable

Java provides the `Cloneable` interface and `Object.clone()` method:

```java
public class Enemy implements Cloneable {
    
    private String name;
    private int health;
    private Position position;
    
    @Override
    public Enemy clone() {
        try {
            Enemy cloned = (Enemy) super.clone();
            // Deep copy mutable fields
            cloned.position = new Position(this.position.x, this.position.y);
            return cloned;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone failed", e);
        }
    }
}
```

**Important:** Java's default `clone()` does a shallow copy. You must manually deep copy any mutable fields.

## Prototype Registry Pattern

Often you'll want to maintain a collection of prototype objects:

```java
public class EnemyRegistry {
    
    private Map<String, Enemy> prototypes = new HashMap<>();
    
    public void registerPrototype(String key, Enemy prototype) {
        prototypes.put(key, prototype);
    }
    
    public Enemy createEnemy(String key) {
        Enemy prototype = prototypes.get(key);
        if (prototype == null) {
            throw new IllegalArgumentException("Unknown enemy type: " + key);
        }
        return (Enemy) prototype.clone();
    }
}
```

Usage:

```java
EnemyRegistry registry = new EnemyRegistry();

// Register prototypes
registry.registerPrototype("orc", new Enemy("Orc", 100, 20, "Sword"));
registry.registerPrototype("goblin", new Enemy("Goblin", 50, 10, "Dagger"));
registry.registerPrototype("dragon", new Enemy("Dragon", 500, 100, "Fire"));

// Create enemies from prototypes
Enemy orc1 = registry.createEnemy("orc");
Enemy orc2 = registry.createEnemy("orc");
Enemy dragon = registry.createEnemy("dragon");
```

This is like having a catalog of templates you can spawn from.

## Real-World Example: Document Templates

```java
public class Document implements Prototype {
    
    private String title;
    private String header;
    private String footer;
    private List<String> paragraphs;
    private Formatting formatting;
    
    public Document(String title) {
        this.title = title;
        this.paragraphs = new ArrayList<>();
        // Load company branding, standard formatting, etc.
        loadCorporateTemplate();
    }
    
    private Document(Document other) {
        this.title = other.title;
        this.header = other.header;
        this.footer = other.footer;
        // Deep copy the list
        this.paragraphs = new ArrayList<>(other.paragraphs);
        // Deep copy formatting
        this.formatting = other.formatting.copy();
    }
    
    @Override
    public Prototype clone() {
        return new Document(this);
    }
    
    private void loadCorporateTemplate() {
        // Expensive operation: load logos, fonts, styles
        System.out.println("Loading corporate template...");
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public void addParagraph(String text) {
        paragraphs.add(text);
    }
}
```

Now creating new documents is fast:

```java
// Create template once
Document template = new Document("Company Report");

// Clone for each report
Document q1Report = (Document) template.clone();
q1Report.setTitle("Q1 2024 Report");
q1Report.addParagraph("Q1 was successful...");

Document q2Report = (Document) template.clone();
q2Report.setTitle("Q2 2024 Report");
q2Report.addParagraph("Q2 exceeded expectations...");
```

## Common Pitfalls and How to Avoid Them

### Pitfall 1: Forgetting Deep Copy

```java
// BAD
private Enemy(Enemy other) {
    this.weapon = other.weapon;  // Sharing same weapon!
}

// If you modify enemy1's weapon, enemy2's weapon changes too
```

**Solution:** Always deep copy mutable objects.

### Pitfall 2: Circular References

```java
class Node {
    Node next;
    
    public Node clone() {
        Node cloned = new Node();
        cloned.next = this.next.clone();  // Infinite recursion if circular!
        return cloned;
    }
}
```

**Solution:** Use a visited set to track already-cloned objects.

### Pitfall 3: Cloning Objects with Resources

```java
class DatabaseConnection {
    Socket socket;
    
    public DatabaseConnection clone() {
        // You can't just copy a socket!
        // Each clone needs its own connection
    }
}
```

**Solution:** Some objects shouldn't be cloned. Not everything is cloneable.

## Prototype vs Factory Patterns

You might be thinking: "How is this different from Factory patterns?"

**Factory patterns:**
- Create new objects from scratch
- Use constructors and initialization logic
- Flexible about what type to create
- Better when objects are fundamentally different

**Prototype pattern:**
- Creates objects by copying
- Bypasses constructors
- Faster when initialization is expensive
- Better when objects are similar with variations

They solve different problems. Sometimes you'll use both together.

## When NOT to Use Prototype

Don't use Prototype when:
- Creating objects is already fast
- Objects have no complex initialization
- Deep copying is complicated or impossible
- Objects have resources that can't be copied (file handles, sockets)
- The cost of cloning isn't significantly less than creating

## Prototype and SOLID Principles

### Single Responsibility Principle

Each class handles its own cloning. The client doesn't need to know the internal structure.

### Open/Closed Principle

New prototype types can be added without modifying existing code. Just implement the Prototype interface.

### Dependency Inversion Principle

Code depends on the Prototype interface, not concrete classes. You can swap prototypes without changing client code.

## The Mental Model

Think of the Prototype pattern as a copy machine:

1. You have a document (prototype)
2. Instead of retyping it, you make photocopies
3. Each copy can be edited independently
4. The original stays intact
5. Making copies is way faster than retyping

## Performance Considerations

Cloning is faster when:
- Object initialization involves I/O operations
- Complex calculations are needed
- External resources must be loaded
- Many objects of the same type are needed

Measure before optimizing. Don't use Prototype just because it sounds cool. Use it when profiling shows object creation is a bottleneck.

## Final Thoughts

The Prototype pattern is about efficiency. When creating objects is expensive and you need many similar objects, cloning beats creating from scratch.

But remember:
- Understand shallow vs deep copying
- Be careful with mutable objects
- Not everything should be cloneable
- Measure performance before optimizing

The pattern shines in specific scenarios: game development, document processing, object pools, and any situation where initialization is costly but copying is cheap.

Like all patterns, it's a tool. Use it when it solves your problem, not just because you learned about it.

Clone responsibly.